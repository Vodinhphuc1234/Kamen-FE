import { Outlet } from 'react-router-dom';

export default function AuthenticationLayout() {
  return (
    <div className="h-100 w-100 d-flex">
      <img className="w-50" src="img/login-bg.jpg" alt="none" />
      <div className="w-50">
        <Outlet />
      </div>
    </div>
  );
}
