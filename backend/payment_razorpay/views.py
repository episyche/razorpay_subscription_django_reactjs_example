from unicodedata import name
from django.shortcuts import render
import razorpay
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


razorpay_client = razorpay.Client(auth=("rzp_test_XjxJeSspeBN1S6", "V4swZ111Dvwl5Zc8uJBChMCH"))

@csrf_exempt
def create_subscription(request):
    if request.method == "POST":

        amount = int(request.POST['price'])
        product_name = request.POST['product_name']
        plan_id = request.POST['plan_id']

        razorpay_subscription_res = razorpay_client.subscription.create({
        'plan_id': plan_id,
        'total_count': 30,
        'addons': [{
                'item': {
                    'name': product_name,
                    'currency': 'INR',
                    "amount": int(amount) * 100,
                    }
                }],
        })

        response_data = {
                "callback_url": "http://127.0.0.1:8000/payment/callback",
                "razorpay_key": "rzp_test_XjxJeSspeBN1S6",
                "order": razorpay_subscription_res,
                "product_name": product_name
        }

        print(response_data)

        return JsonResponse(response_data)


@csrf_exempt
def subscription_callback(request):
    if request.method == "POST":
        if "razorpay_signature" in request.POST:
            payment_verification = razorpay_client.utility.verify_subscription_payment_signature(request.POST)
            if payment_verification:
                return JsonResponse({"res":"Subscription is active"})
                # Logic to perform is payment is successful
                # Create subscription logic
            else:
                return JsonResponse({"res":"failed"})
                # Logic to perform is payment is unsuccessful



# def verify_signature(response_data):
#     client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
#     res_var = client.utility.verify_subscription_payment_signature(response_data)
#     return res_var