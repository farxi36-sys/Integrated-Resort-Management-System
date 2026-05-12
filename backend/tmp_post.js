(async ()=>{
  try{
    const res = await fetch('http://localhost:5000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'uday', businessName: 'uday stores', email: 'farxi36+node@example.com', password: 'password123' })
    });
    const data = await res.text();
    console.log(res.status, data);
  }catch(err){
    console.error('ERR', err.message);
  }
})();
