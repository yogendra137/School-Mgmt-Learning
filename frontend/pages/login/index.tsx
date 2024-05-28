import { Login } from '@/components/organisms/login';
import instance from '@/config/axios';
import encryptPassword from '@/config/encryptPassword';
import { ILoginParams } from '@/interfaces';
import { useAppDispatch } from '@/store';
import { setAuthState } from '@/store/slices/authSlice';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const mutation = useMutation({
		mutationFn: ({ email, password }: ILoginParams) => {
			// Assuming instance.post expects an object with email and password
			return instance.post('/auth/login', { email, password });
		},
		onSuccess: (data) => {
			dispatch(setAuthState(true));
			router.push('/dashboard');
		},
	});

	const onSubmit = () => {
		mutation.mutate({
			email: 'project1@gmail.com',
			password: encryptPassword('Project@123'),
		});
	};

	return <Login onSubmit={onSubmit} />;
}
