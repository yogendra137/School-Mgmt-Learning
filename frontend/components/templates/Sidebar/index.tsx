import styles from './styles.module.scss';
import classNames from 'classnames';
import Link from 'next/link';
import {
	BootCampIcon,
	DashboardIcon,
	MedicalCordIcon,
	MedicalPracIcon,
	ProjectCordIcon,
	ReportIcon,
	ResourceIcon,
	SchoolIcon,
	Setting,
	TestTypeIcon,
	VolunteerIcon,
} from '@/components/Icons';

const menuItems = [
	{ href: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
	{ href: '/schools', icon: <SchoolIcon />, label: 'Schools' },
	{
		href: '/project-coordinators',
		icon: <ProjectCordIcon />,
		label: 'Project Coordinator',
	},
	{
		href: '/medical-coordinators',
		icon: <MedicalCordIcon />,
		label: 'Medical Coordinator',
	},
	{
		href: '/medical-practitioners',
		icon: <MedicalPracIcon />,
		label: 'Medical Practitioner',
	},
	{ href: '/volunteers', icon: <VolunteerIcon />, label: 'Volunteer' },
	{ href: '/add-school', icon: <BootCampIcon />, label: 'Boot Camp' },
	{ href: '/', icon: <ResourceIcon />, label: 'Resource & Guide' },
	{ href: '/', icon: <TestTypeIcon />, label: 'Test Type' },
	{ href: '/', icon: <ReportIcon />, label: 'Report' },
];

export const Sidebar = () => {
	return (
		<div className={classNames(classNames, styles.sidebar)}>
			<div className={styles.sidebarInner}>
				<ul className={styles.sidebarMenu}>
					{menuItems.map((item, index) => (
						<li key={index}>
							<Link href={item.href}>
								<span>{item.icon}</span>
								{item.label}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Sidebar;
