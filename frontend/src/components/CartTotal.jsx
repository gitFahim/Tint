import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = ({ city }) => {
    const { currency, getCartAmount } = useContext(ShopContext);

    // Calculate delivery fee based on city
    const calculateDeliveryFee = (city = "", subtotal) => {
        let deliveryFee = 100; // Default delivery fee for cities other than Dhaka

        if (city.trim().toLowerCase() === "dhaka") {
            deliveryFee = 60; // Delivery fee for Dhaka
        }

        if (subtotal >= 2000) {
            deliveryFee = 0; // Free delivery for orders >= 2000
        }

        return deliveryFee;
    };

    const subtotal = getCartAmount();
    const deliveryFee = calculateDeliveryFee(city, subtotal);
    const totalAmount = subtotal + deliveryFee;

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={'CART'} text2={'TOTAL'} />
            </div>
            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p className='text-lg font-medium'>Sub Total</p>
                    <p className='text-lg font-medium'>
                        {currency}&nbsp;{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p className='text-lg font-medium'>Shipping Fee</p>
                    <p className='text-lg font-medium'>
                        {currency}&nbsp;{deliveryFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p className='text-2xl font-semibold'>Total Amount</p>
                    <p className='text-2xl font-semibold'>
                        {currency}&nbsp;{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartTotal;