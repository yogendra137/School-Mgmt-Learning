import { Col, Row } from 'react-bootstrap';
import styles from './styles.module.scss';
import Image from 'next/image';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { Notification, ProfileAvatar, Setting } from '@/components/Icons';
const Logo = () => {
  return (
    <div className={styles.logo}>
      <Image
        src='./images/logo.svg'
        width={400}
        height={108}
        alt='Logo ICU2 Foundation'
      />
    </div>
  );
};

const LoggedInMenu = () => {
  return (
    <div className={styles.right}>
      <ul className={classNames(styles.menus)}>
        <li>
          <Link href='/'>
            <Setting />
          </Link>
        </li>
        <li>
          <Link href='/'>
            <Notification />
          </Link>
        </li>
      </ul>

      <div className={styles.profile}>
        <ProfileAvatar />
        <p>
          <strong> Yogendra Jain, </strong> <br />
          yogendra.j@chapter247
        </p>
      </div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className={styles['header-wrapper']}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <Row className='align-items-center'>
            <Col xs={3}>
              <Logo />
            </Col>
            <Col xs={9}>
              <LoggedInMenu />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Header;
