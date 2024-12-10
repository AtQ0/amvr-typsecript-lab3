import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <header className={styles.container}>
        <nav className={styles.navBar}>
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/posts'>Posts</Link>
            </li>
            <li>
              <Link to='/auth/admin'>Admin</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className={styles.mainContainer}>{children}</main>
    </>
  );
};

export default Layout;
