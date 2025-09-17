import axios from "axios";
import qs from "querystring"; // important for form-urlencoded

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, customer_name, customer_email, customer_phone, order_id } = body;

    // SSLCommerz sandbox credentials
    const store_id = "sandbox"; // replace with your sandbox store id
    const store_passwd = "sandbox"; // replace with your sandbox password
    const post_data = {
      store_id,
      store_passwd,
      total_amount: amount,
      currency: "BDT",
      tran_id: order_id,
      success_url: "http://localhost:3000/success",
      fail_url: "http://localhost:3000/fail",
      cancel_url: "http://localhost:3000/cancel",
      emi_option: 0,
      cus_name: customer_name,
      cus_email: customer_email,
      cus_phone: customer_phone,
      shipping_method: "NO",
      num_of_item: 1,
      product_name: "Order Payment",
      product_category: "Food",
      product_profile: "general",
    };

    const sslcommerz_url = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

    // Convert JSON to x-www-form-urlencoded
    const response = await axios.post(sslcommerz_url, qs.stringify(post_data), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    return new Response(JSON.stringify({ error: "Payment initiation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
