import { useMutation } from '@tanstack/react-query';
import instance from '../config/axios';

const retrieveData = async (url) => {
	const response = await instance({
		url,
		method: 'POST',
	});
	return response.data;
};

function useMutationData(queryKey = [], url = '', parameters = {}) {
	const {
		isPending,
		error,
		isLoading,
		data = {},
		isRefetching,
		refetch,
	} = useMutation({
		queryKey,
		queryFn: () => retrieveData(url),
		...parameters,
	});

	if (error) return 'An error has occurred: ' + error.message;
	return {
		initialLoading: isPending,
		isLoading: isPending || isRefetching,
		error,
		data,
		refetch,
	};
}

export default useMutationData;
