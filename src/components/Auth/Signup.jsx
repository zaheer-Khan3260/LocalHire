import React, { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import InputComponent from "../helper/Input.jsx"
import { Link, useNavigate } from 'react-router-dom';
import { api, customServerApi } from '../../utils/api.js';
// import { uploadOnCloudinary } from '../../utils/Cloudinary.js';


export const uploadImage = async(formData) => {
  try {
    const response = await customServerApi.post("/cloudinary/uploadImage", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if(response.data) return response.data.url;
  } catch (error) {
    console.log("An error occured while uploading the image")
  }

}


export const createUser = async(formattedData) => {

  try {
    const response = await api.post("/api/ai/user", formattedData);

      if (response.status === 201 && response.data) {
        console.log("Signup successful");
        return true
      } else {
        throw new Error("Unexpected response from server");
      }
  } catch (error) {
    console.error("Signup error:", error);
    throw new Error(error);
  }
}

export default function SignupPage() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [role, setRole] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [profileImage, setProfileImage] = useState()

  const handleMouseEnter = useCallback((index) => {
    setHoveredCell(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredCell(null);
  }, []);

  const colors = useMemo(() => [
    'bg-red-500', 'bg-blue-500', 'bg-green-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ], []);

  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);
    
    const formData = new FormData()
    formData.append('profileImage', profileImage); 
      
    const profileImageUrl = await uploadImage(formData);

    if(profileImageUrl){
      const formattedData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        location: {
          address: data.address,
          state: data.state,
          pincode: data.pincode
        },
        designation: data.designation ? data.designation : "",
        profileImage: profileImageUrl,
        verified: false,
        isAvailable: true
      };

      console.log("Submitting data:", formattedData);
        
        if(formattedData.profileImage !== undefined){
          try {
              const user = await createUser(formattedData);
              if(user){
                navigate("/login")
              }
          } catch (error) {
            if (error.response) {
              if (error.response.status === 400) {
                setError(error.response.data.message || "Invalid input. Please check your details.");
              } else if (error.response.status === 409) {
                setError("An account with this email already exists.");
              } else {
                setError("An error occurred during signup. Please try again.");
              }
            } else if (error.request) {
              setError("No response from server. Please check your internet connection.");
            } else {
              setError("An unexpected error occurred. Please try again.");
            }
          }
        }
      }


    
  };



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const nextSlide = () => {
    setCurrentSlide(1);
  };

  const prevSlide = () => {
    setCurrentSlide(0);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(file)
      const previewUrl = URL.createObjectURL(file);
      console.log("image file url: ", previewUrl.split('/')[3])
      setImagePreview(previewUrl);
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white relative">
      {/* Grid background */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-2 p-1 overflow-hidden">
        {[...Array(144)].map((_, i) => (
          <div
            key={i}
            className={`bg-gray-800 bg-opacity-30 rounded-lg transition-all duration-500 ${
              hoveredCell === i ? `${colors[i % colors.length]} bg-opacity-50 scale-110` : ''
            }`}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
          ></div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center h-screen pointer-events-none">
        <div className="w-[80%] h-[82%] bg-gray-800 bg-opacity-80 rounded-xl shadow-lg flex pointer-events-auto">
          <div className="w-1/2 p-6 bg-purple-700 rounded-xl">
            <h2 className="text-3xl font-bold mb-2">LocalHire</h2>

          </div>
          <div className="w-[calc(50%-15rem)] p-6 flex flex-col mx-auto">
            <p className="mb-6 text-end">Already have an account? 
              <Link to="/login" className="text-purple-400 hover:underline">Log in</Link>
            </p>
            <h1 className="text-2xl font-bold my-4 text-center">Create an account</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 relative ">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out" 
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  <div className="w-full flex-shrink-0 space-y-4 p-4">
                    <InputComponent
                      {...register("name", { required: true })}
                      label="Name"
                      className="p-2 rounded-3xl"
                      placeholder="eg: John Doe"
                    />
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
                        {...register("password", { required: true, minLength: 8 })}
                        className="w-full p-2 pr-10"
                        placeholder="8+ Character"
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
                    <div className='w-full relative'>
                      <InputComponent
                        label="Profile Image"
                        type="file"
                        name="profileImage"
                        className="h-36 w-[17.9rem] mt-10 opacity-0 absolute cursor-pointer z-50"
                        style={{ top: 0, left: 0 }} // Position it over the div
                        onChange={handleImageChange} // Handle file selection
                      />
                        {imagePreview ? (
                          <div className='w-[19rem] rounded-full flex justify-center items-center gap-4 '>
                          <img src={imagePreview} alt="Image Preview" className="w-[10rem] h-[10rem] object-cover rounded-full" />
                          <div className='px-3 h-fit py-2 bg-blue-500 rounded-xl'>
                            Change Image
                          </div>
                          </div>
                        ) : (
                        
                          <div className='border-2 border-gray-400 border-dashed w-[18rem] h-36 rounded-lg text-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='mx-auto mt-5' width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21" />
                              <path d="m14 19.5 3-3 3 3" />
                              <path d="M17 22v-5.5" />
                              <circle cx="9" cy="9" r="2" />
                            </svg>
                            <p className='text-[10px] mt-2'>Click or Drag a file</p>
                            <span className="text-gray-500 text-xl mt-5">Upload Image</span>
                            </div>
                          
                        )}
                    </div>
                    <button type="button" onClick={nextSlide} className="w-full bg-purple-600 p-2 rounded-xl hover:bg-purple-700 transition">Next</button>
                  </div>
                  <div className="w-full flex-shrink-0 space-y-4 px-4">
                    <div>
                      <label className="block mb-2">Role</label>
                      <select {...register("role", { required: true })} className="w-full p-2 bg-gray-700 rounded-xl" onChange={(e) => setRole(e.target.value)}>
                        <option value="">Select a role</option>
                        <option value="user">Hire Worker</option>
                        <option value="worker">Become Worker</option>
                      </select>
                    </div>
                    {role === "worker" && (
                      <InputComponent
                        {...register("designation", { required: true })}
                        label="Designation"
                        className="w-full p-2"
                        placeholder="eg: Plumber, Electrician, Student etc."
                      />
                    )}
                    <InputComponent
                      {...register("address", { required: true })}
                      label="Address"
                      className="w-full p-2"
                      placeholder="Enter your address"
                    />
                    <div className='flex space-x-4'>
                      <InputComponent
                        {...register("state", { required: true })}
                        label="State"
                        className="w-full p-2"
                        placeholder="State"
                      />
                      <InputComponent
                        {...register("pincode", { required: true, pattern: /^\d{6}$/ })}
                        label="Pin Code"
                        className="w-full p-2"
                        placeholder="Pin code"
                      />
                    </div>
                      <div className="relative xl:w-[26rem]">
                        <input
                          type="checkbox"
                          className="absolute top-[0.38rem] left-1"
                          required
                        />
                        <h2 className="inline-block ml-6 font-semibold">
                          Creating an account means you're okay with our{" "}
                          <a href="#" className="text-blue-600">
                            Terms of Service, Privacy Policy,
                          </a>
                          and default{" "}
                          <a href="#" className="text-blue-600">
                            Notification Setting
                          </a>
                        </h2>
                      </div>
                    <div className="flex space-x-4 mt-4">
                      <button type="button" onClick={prevSlide} className="w-1/2 bg-gray-600 p-2 rounded-xl hover:bg-gray-700 transition">Previous</button>
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`w-1/2 p-2 rounded-xl transition ${
                          isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                      >
                        {isLoading ? 'Creating account...' : 'Create account'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}