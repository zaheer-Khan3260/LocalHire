import React, {useEffect, useState} from 'react'
import InputComponent from '../helper/Input'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../utils/api.js';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authSlice.js';
import { logout } from '../../store/authSlice.js';



function Login() {
  const { register, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.userData);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if(currentUser){
      navigate('/')
    }else{
      dispatch(logout())
    }
  }, [currentUser, navigate])
 console.log("current user: ", currentUser);
 
  const onSubmit = async(data) => {
    try {
      setError(''); 
      
      const response = await api.post('/api/user/login', {
        email: data.email,
        password: data.password
      });

      if (response.status === 200 && response.data) {
        
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        const userData = {
          ...Object.fromEntries(Object.entries(response.data).filter(([key]) => !['password'].includes(key)))
        }
        console.log("userData in login: ", userData)
        const currentDate = new Date();
        localStorage.setItem('lastLoginDate', currentDate.toISOString());
        dispatch(login(userData));
        navigate('/');
      } else {
        console.error('Unexpected response:', response);
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          setError('Invalid email or password. Please try again.');
        } else if (error.response.data) {
          setError(error.response.data);
        } else {
          setError('An error occurred. Please try again.');
        }
      } else if (error.request) {
        setError('No response from server. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <div className="h-screen bg-gray-900 text-white relative">

        {/* Grid background */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-2 p-1 overflow-hidden">
          {[...Array(144)].map((_, i) => (
            <div
              key={i}
              className={`bg-gray-800 bg-opacity-30 rounded-lg transition-all duration-500`}
            ></div>
          ))}
        </div>
        
        {/* Main content */}
        <div className="relative z-10 flex items-center justify-center h-screen pointer-events-none">
          <div className="w-[80%] h-[82%] bg-gray-800 bg-opacity-80 rounded-xl shadow-lg flex pointer-events-auto">
            <div className="w-1/2 p-6 bg-purple-700 rounded-xl flex flex-col justify-between">
              <h2 className="text-3xl font-bold mb-2">LocalHire</h2>
              <h3 className="text-2xl font-semibold mb-4">Welcome Back,<br />Let's Continue Your Journey</h3>
            </div>
            <div className="w-[calc(50%-15rem)] p-6 flex flex-col mx-auto">
              <p className="mb-6 text-end">Don't have an account? 
                <Link to="/signup" className="text-purple-400 hover:underline">Sign up</Link></p>
              <h1 className="text-2xl font-bold my-6 text-center">Log In</h1>
              {error && <p className="text-red-500 text-center">{error}</p>}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputComponent
                  {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                  label="Email"
                  className="w-full p-2"
                  placeholder="john@gmail.com"
                />
                <div className="relative">
                  <InputComponent
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    {...register("password", { required: true })}
                    className="w-full p-2 pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 top-8 pr-3 flex items-center text-sm leading-5"
                  >
                    {showPassword ? (
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                <button type="submit" className="w-full bg-purple-600 p-2 rounded-xl hover:bg-purple-700 transition">Log in</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
