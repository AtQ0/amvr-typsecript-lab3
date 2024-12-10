import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './profile.module.css';
import { Box, Card, Flex, Text } from '@radix-ui/themes';

interface User {
  id?: number;
  first_name: string;
  last_name: string;
  role: string;
  email_address: string;
  date_of_birth: string;
  created_at: string;
  modified_at: string;
}

const UserProfile: FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User>({
    id: undefined,
    first_name: '',
    last_name: '',
    role: '',
    date_of_birth: '',
    email_address: '',
    created_at: '',
    modified_at: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/profile?id=${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUser(data[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <Box maxWidth='500px' className={styles.container}>
      <Card variant='surface'>
        <h1>{user.first_name + ' ' + user.last_name}</h1>
        {user.id !== undefined ? (
          <Flex direction='column' gap='2' key={user.id}>
            <Text>First Name: {user.first_name}</Text>
            <Text>Last Name: {user.last_name}</Text>
            <Text>Role: {user.role}</Text>
            <Text>Email Address: {user.email_address}</Text>
            <Text>
              DOB: {new Date(user.date_of_birth).toISOString().split('T')[0]}
            </Text>

            <Text>
              Created At:{' '}
              {new Date(user.created_at).toISOString().split('T')[0]}{' '}
            </Text>
            <Text>
              Updated At:{' '}
              {new Date(user.modified_at).toISOString().split('T')[0]}{' '}
            </Text>
            {/* <Button>Edit</Button> */}
          </Flex>
        ) : (
          <div>No profile data found</div>
        )}
      </Card>
    </Box>
  );
};

export default UserProfile;
// Ryan
