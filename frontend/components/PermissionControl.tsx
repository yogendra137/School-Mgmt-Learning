import React from 'react';

function PermissionControl({
	children,
}: Readonly<React.PropsWithChildren<{}>>) {
	return <div>{children}</div>;
}

export default PermissionControl;
