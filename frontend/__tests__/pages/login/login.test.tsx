import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import LoginPage from "@/pages/login";
import { rootReducer, useAppDispatch } from "@/store";
import { setAuthState } from "@/store/slices/authSlice";
import { useMutation } from "@tanstack/react-query";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));
// Mocking dependencies
jest.mock("@/store", () => ({
  useAppDispatch: jest.fn(),
  rootReducer: jest.requireActual("@/store").rootReducer, // Import the actual rootReducer
}));

jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
}));

// Mock configureStore to return a simple store
// jest.mock("@reduxjs/toolkit", () => ({
//   ...jest.requireActual("@reduxjs/toolkit"),
//   configureStore: jest.fn(() => ({
//     getState: jest.fn(() => ({})),
//     dispatch: jest.fn(),
//     subscribe: jest.fn(),
//   })),
// }));

const mockUseAppDispatch = useAppDispatch as jest.MockedFunction<
  typeof useAppDispatch
>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseMutation = useMutation as jest.MockedFunction<typeof useMutation>;

const renderWithProvider = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: rootReducer, // Pass the rootReducer here
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("LoginPage", () => {
  const mockDispatch = jest.fn();
  const mockPush = jest.fn();
  const mockMutate = jest.fn();

  beforeEach(() => {
    mockUseAppDispatch.mockReturnValue(mockDispatch);
    mockUseRouter.mockReturnValue({ push: mockPush } as any);
    mockUseMutation.mockReturnValue({
      mutate: mockMutate,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders a heading", () => {
    renderWithProvider(<LoginPage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Login Page");
  });

  it("calls onSubmit when the form is submitted", async () => {
    renderWithProvider(<LoginPage />);

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        email: "rohit@gmail.com",
        password: expect.any(String), // Since password is encrypted, we expect any string
      });
    });
  });

  // it("handles successful login", async () => {
  //   const mockResponse = {
  //     data: { token: "mockToken" },
  //   };

  //   mockMutate.mockImplementation(({ onSuccess }) => {
  //     onSuccess(mockResponse);
  //   });

  //   renderWithProvider(<LoginPage />);

  //   const loginButton = screen.getByRole("button", { name: /login/i });
  //   fireEvent.click(loginButton);

  //   await waitFor(() => {
  //     expect(localStorage.setItem).toHaveBeenCalledWith("token", "mockToken");
  //     expect(mockDispatch).toHaveBeenCalledWith(setAuthState(true));
  //     expect(mockPush).toHaveBeenCalledWith("/dashboard");
  //   });
  // });
});

