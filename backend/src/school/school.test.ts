// // Import necessary modules and types
// import addSchool  from '../school/school.controller'; // Import the addSchool function from your API
// import schoolModel from '../school/school.model'; // Import the schoolModel if needed
// import { message } from '../common/messages'; // Import message constant if needed
// import { describe, it } from 'node:test';

// // Mock schoolModel.create function
// jest.mock(schoolModel, () => ({
//     create: jest.fn(), // Mock the create function
// }));

// // Mock schoolData object
// const schoolData = {
//     body: {
//         schoolName: 'Test School',
//         contactPerson: 'John Doe',
//         contactEmail: 'john.doe@example.com',
//         contactNumber: '1234567890',
//         city: 'Test City',
//         state: 'Test State',
//         country: 'Test Country',
//         createdBy: 'testUser',
//         updatedBy: 'testUser',
//     },
// };

// describe('addSchool', () => {
//     it('should add a new school', async () => {
//         // Mock schoolModel.create to resolve successfully
//         (schoolModel.create as jest.Mock).mockResolvedValueOnce(undefined);

//         // Call addSchool function with mock schoolData
//         const result = await addSchool(schoolData);

//         // Assert that schoolModel.create is called with correct arguments
//         expect(schoolModel.create).toHaveBeenCalledWith({
//             schoolName: 'Test School',
//             contactPerson: 'John Doe',
//             contactEmail: 'john.doe@example.com',
//             contactNumber: '1234567890',
//             location: {
//                 city: 'Test City',
//                 state: 'Test State',
//                 country: 'Test Country',
//             },
//             isActive: true,
//             createdBy: 'testUser',
//             updatedBy: 'testUser',
//         });

//         // Assert that the result is as expected
//         expect(result).toEqual({
//             message: message.schoolAddSuccess,
//             status: true,
//         });
//     });

//     // Add more test cases for error handling, etc. if needed
// });
