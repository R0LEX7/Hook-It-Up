export interface IUser {
  _id: string;
  username: string;
  lastName: string;
  firstName: string;
  age: number ;
  hobbies?: string[];
  profilePic?: string;
  bio?: string;
  gender?: string;
  [key: string]: any;
}
