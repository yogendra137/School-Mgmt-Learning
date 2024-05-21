import { useQuery } from '@tanstack/react-query';
import instance from '../config/axios';

const retrieveData = async (url) => {
	const { search } = document.location;

	const response = await instance({
		url: `${url}${search}`,
		method: 'GET',
	});
	return response.data;
};

function useQueryData(queryKey = [], url = '', parameters = {}) {
	const {
		isPending,
		error,
		data = {},
		isRefetching,
		refetch,
	} = useQuery({
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

export default useQueryData;
