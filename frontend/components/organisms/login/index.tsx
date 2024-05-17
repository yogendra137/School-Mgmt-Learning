'use client';

import Button from '@/components/atoms/Button';
import styles from './styles.module.scss';
import Image from 'next/image';
import { Row, Col } from 'react-bootstrap';
import Input from '@/components/atoms/Input';
import { ChangeEvent } from 'react';

/** Login Component */

export const Login = () => {
  return (
    <div className={styles.login}>
      <Row>
        <Col lg={6}>
          <div className={styles.authCover}>
            <Image
              src='/images/logo.svg'
              width={400}
              height={108}
              alt='Logo ICU2 Foundation'
            />
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              <br /> In scelerisque purus vel quam bibendum mattis.
            </p>
          </div>
        </Col>
        <Col lg={6}>
          <div className={styles.loginForm}>
            <div className={styles.loginBlock}>
              <h2 className={styles.title}>Login</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor.
              </p>

              <Input
                type='text'
                placeholder='yourmail@email.com'
                label='Email ID*'
                value={''}
              ></Input>

              <Input
                type='password'
                placeholder='************'
                label='Password'
              ></Input>
              <Button
                type='submit'
                className='btn btn-primary'
                value='Login'
              
              >
                Login
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
