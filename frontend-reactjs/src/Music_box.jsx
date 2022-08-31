import Book1Img from './img/image1.png';
import { useEffect } from 'react';

export default function Music_box(){

    const loadScript = (src) => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = () => {
            resolve(true);
          };
          script.onerror = () => {
            resolve(false);
          };
        document.body.appendChild(script);
      });
    };
  
    useEffect(() => {
        loadScript("https://checkout.razorpay.com/v1/checkout.js");
    });


    function makePayment(e, price, product_name, plan_id){

        e.preventDefault();


        let formData = new FormData();
        formData.append('price', price);
        formData.append('product_name', product_name);
        formData.append('plan_id', plan_id);

        async function paymentGateway() {
            const url = 'http://127.0.0.1:8000/payment/new-subscription' // <<< new-subscription backend api url path
            const res = await fetch(url, { method: 'POST', body: formData , 
            })
            const jsonRes = await res.json()
            return jsonRes
        }

        paymentGateway().then((res) =>{
            //_________ call razorpay gateway ________
            var options = {
                "key": res['razorpay_key'],
                "amount": res['order']['amount'],
                "currency": res['order']['currency'],
                "callback_url": res['callback_url'],
                prefill: {
                    "email": "nosob88243@xitudy.com",
                    "contact": "1234567890"
                },
                "name": res['product_name'],
                "subscription_id": res['order']['id'],
            };
  
            var rzp1 = new window.Razorpay(options);
            rzp1.open();
        })
        
    }


    return(
        <>
            <section className='flex justify-center mt-52'>
                <div className='rounded px-10 py-5 text-center drop-shadow-xl bg-zinc-50'>
                    <h2 className='text-3xl mb-10'>Monthly Subscription</h2>
                    <img className='w-48 mx-auto' src={Book1Img} alt="" />
                    <p className='mt-5 text-lg'>Price : ₹ 30</p>
                    <button type='button' className="mt-2 mb-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-lg font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                     onClick={e=>{makePayment(e, 1, "Monthly Subscription", "plan_KBosdfjkhgsdjhfgs")}}
                     >Proceed to Buy</button>
                </div>
            </section>
        </>
    )

}