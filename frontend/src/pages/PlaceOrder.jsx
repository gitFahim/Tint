import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod');

  const {navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products} = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    zipcode:'',
    country:'',
    phone:''
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value

    setFormData(data => ({...data,[name]:value}))
  }
  
  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      
      let orderItems = []
      for( const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      } 
      
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      switch (method) {
        
        // API calls for COD
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers:{token}})
      
          if (response.data.success) {
            setCartItems({})
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
          break;
        
          case 'bkash':
            const bkashResponse = await axios.post(backendUrl + '/api/order/place-bkash', orderData, { headers: { token } });
            if (bkashResponse.data.success) {
              setCartItems({});
              navigate('/orders');
            } else {
              toast.error(bkashResponse.data.message);
            }
            break;
        
          case 'steadfast':
            const steadfastResponse = await axios.post(backendUrl + '/api/order/place-steadfast', orderData, { headers: { token } });
            if (steadfastResponse.data.success) {
              setCartItems({});
              navigate('/orders');
            } else {
              toast.error(steadfastResponse.data.message);
            }
            break;

        default:
          break

      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  
  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:pt-14 min-h-[80vh] border-t'>
      {/* Left Side Content */}
      <div className='flex flex-col w-full gap-4 sm:max-w-[480px]'>
        <div className='my-3 text-xl sm:text-2xl'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required  onChange={onChangeHandler} name='firstName' value={formData.firstName}
            className='w-full px-4 py-2 border border-gray-300 rounded' 
            type="text" 
            placeholder='First Name' 
          />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName}
            className='w-full px-4 py-2 border border-gray-300 rounded' 
            type="text" 
            placeholder='Last Name' 
          />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email}
          className='w-full px-4 py-2 border border-gray-300 rounded' 
          type="email" 
          placeholder='Email Address' 
        />
        <input required onChange={onChangeHandler} name='street' value={formData.street}
          className='w-full px-4 py-2 border border-gray-300 rounded' 
          type="text" 
          placeholder='Street' 
        />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city}
            className='w-full px-4 py-2 border border-gray-300 rounded' 
            type="text" 
            placeholder='City' 
          />
        </div>
        <div className='flex gap-3'>
          <input required  onChange={onChangeHandler} name='zipcode' value={formData.zipcode}
            className='w-full px-4 py-2 border border-gray-300 rounded' 
            type="number" 
            placeholder='Zip Code' 
          />
          <input required onChange={onChangeHandler} name='country' value={formData.country}
            className='w-full px-4 py-2 border border-gray-300 rounded' 
            type="text" 
            placeholder='Country' 
          />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone}
          className='w-full px-4 py-2 border border-gray-300 rounded' 
          type="number" 
          placeholder='Mobile Numeber' 
        />
      </div>
      {/* Right Side Content */}
      <div className='mt-8'>
        <div className="mt-8 min-w-80">
          <CartTotal city={formData.city || ""} /> {/* Pass a default value if city is undefined */}
        </div>
        {/* Payment Methods Selection */}
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHODS'} />
          <div className='flex flex-col gap-3 lg:flex-row'>
              {/* Bkash Payment Option */}
              <div onClick={() => setMethod('bkash')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'bkash' ? 'bg-green-600' : ''}`}></p>
                <img className='h-5 mx-4' src={assets.BkashLogo} alt="Bkash" />
                <p className='text-sm font-medium text-gray-500'>Bkash</p>
              </div>

              {/* Steadfast Payment Option */}
              <div onClick={() => setMethod('steadfast')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'steadfast' ? 'bg-green-600' : ''}`}></p>
                <img className='h-5 mx-4' src={assets.steadfast_logo} alt="Steadfast" />
                <p className='text-sm font-medium text-gray-500'>Steadfast</p>
              </div>
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-600' : ''}`}></p>
              <p className='mx-4 text-sm font-medium text-gray-500'>CASH ON DELIVERY</p>

          </div>
          <div className='w-full mt-8 text-end'>
            <button type='submit' className='px-16 py-3 text-sm text-white bg-black active:bg-gray-800'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
