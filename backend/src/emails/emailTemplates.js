export function createWelcomeEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ShopTemple</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    
    <!-- Header Section -->
    <div style="background: linear-gradient(to right, #6a11cb, #2575fc); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <!-- می‌توانید این ایموجی را با آدرس لوگوی خود عوض کنید -->
      <div style="background-color: white; width: 80px; height: 80px; margin: 0 auto 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">🛍️</div>
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 500;">Welcome to ShopTemple!</h1> 
    </div> 

    <!-- Content Section -->
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);"> 
      <p style="font-size: 18px; color: #2575fc;"><strong>Hello ${name},</strong></p> 
      <p>We're thrilled to have you join ShopTemple! Your account is ready, and we can't wait for you to explore our curated selection of products.</p> 
       
      <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #6a11cb;"> 
        <p style="font-size: 16px; margin: 0 0 15px 0;"><strong>Start your shopping journey:</strong></p> 
        <ul style="padding-left: 20px; margin: 0;"> 
          <li style="margin-bottom: 10px;">Browse our latest arrivals</li> 
          <li style="margin-bottom: 10px;">Add items to your Wishlist</li> 
          <li style="margin-bottom: 10px;">Enjoy secure and fast checkout</li> 
          <li style="margin-bottom: 0;">Track your orders in real-time</li> 
        </ul> 
      </div> 
       
      <!-- Call to Action -->
      <div style="text-align: center; margin: 30px 0;"> 
        <a href="${clientURL}" style="background: linear-gradient(to right, #6a11cb, #2575fc); color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 500; display: inline-block;">Start Shopping</a> 
      </div> 
       
      <p style="margin-bottom: 5px;">If you have any questions or need help with your order, our support team is just a message away.</p> 
      <p style="margin-top: 0;">Happy Shopping!</p> 
       
      <p style="margin-top: 25px; margin-bottom: 0;">Best regards,<br>The ShopTemple Team</p> 
    </div> 
     
    <!-- Footer Section -->
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;"> 
      <p>© 2026 ShopTemple. All rights reserved.</p> 
      <p> 
        <a href="#" style="color: #2575fc; text-decoration: none; margin: 0 10px;">Privacy Policy</a> 
        <a href="#" style="color: #2575fc; text-decoration: none; margin: 0 10px;">Terms of Service</a> 
        <a href="#" style="color: #2575fc; text-decoration: none; margin: 0 10px;">Contact Support</a> 
      </p> 
    </div> 
  </body> 
  </html> 
  `; 
}

