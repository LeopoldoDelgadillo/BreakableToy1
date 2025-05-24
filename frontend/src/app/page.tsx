'use client';
import { JSX, useEffect, useState } from "react";

export default function Home() {
  const[productInfo, setProductInfo] = useState([]);
  useEffect(() => {
    const getProducts = async (page: number, sort?: string) =>{
      try{
        let url = `http://localhost:9090/products?page=${page}`;
        if (sort) url += `&sort=${sort}`;
        const response = await (await fetch(url)).json();
        console.log("Fetched products:", response);
        setProductInfo(response.pageList);
      }catch (error){
        console.error("Error fetching products:", error);
      }
    }
    getProducts(0);
  }, []);

  const rows = productInfo.map((product:any) => (
    <tr key={product.productId}>
      <td style={{ border: "1px solid gray", textAlign:"center"}}><input type="checkbox"></input></td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.category}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.name}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.unitPrice}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.expirationDate.toString()}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.stock}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}><button>Edit</button>/<button>Delete</button></td>
    </tr>
  ));
      
  return (
    <main>
      <div
        className="SearchBlock"
        style={{ border: "1px solid black", width: "98%", height: "180px", margin: "1%" }}>
        <form style={{width:"50%", marginLeft: "auto",marginRight:"auto"}}>
          <label htmlFor="name" style={{width:"auto", marginLeft: "40%",marginRight:"2%"}}>Name</label>
          <input type="text" id="name" name="name" style={{ border: "1px solid black" , width:"20%", height: "25px", marginLeft:"2%"}}></input><br></br>
          <label htmlFor="categories">Category</label>
          <select id="categories" name="categories" style={{ border: "1px solid black", width: "160px", height: "25px", marginLeft:"4%" }}></select><br></br>
          <label htmlFor="availability">Availability</label>
          <select id="availability" name="availability" style={{border: "1px solid black",width: "150px", height:"25px", marginLeft:"4%"}}></select><br></br>
          <input type="submit" value="Search" style={{border: "1px solid black",width: "80px", height:"25px", marginTop: "5px", textAlign:"center"}}></input>
        </form>
      </div>
      <div style={{width:"120px", marginLeft: "auto", marginRight: "auto"}}>
        <input 
          type="submit" 
          value="New product" 
          style={{border: "1px solid black",width:"120px", textAlign: "center"}}>
        </input>
      </div>
      <div>
          <table style={{border: "1px solid black", width: "98%", margin: "1%"}}>
            <thead style={{border: "1px solid black", width: "98%", fontSize: "14px"}}>
              <tr>
                <th scope="col" style={{border: "1px solid black", width: "5%",textAlign:"center"}}><input type="checkbox"></input></th>
                <th scope="col" style={{border: "1px solid black", width: "20%", margin: "10px", textAlign:"center"}}>Category&lt;&gt;</th>
                <th scope="col" style={{border: "1px solid black", width: "25%", margin: "10px", textAlign:"center"}}>Name&lt;&gt;</th>
                <th scope="col" style={{border: "1px solid black", width: "10%", margin: "10px", textAlign:"center"}}>Price&lt;&gt;</th>
                <th scope="col" style={{border: "1px solid black", width: "25%", margin: "10px", textAlign:"center"}}>Expiration Date&lt;&gt;</th>
                <th scope="col" style={{border: "1px solid black", width: "5%", margin: "10px", textAlign:"center"}}>Stock&lt;&gt;</th>
                <th scope="col" style={{border: "1px solid black", width: "20%", margin: "10px", textAlign:"center"}}>Actions&lt;&gt;</th>
              </tr>
            </thead>
            <tbody style={{border: "1px solid black", width: "98%", fontSize: "14px"}}>
                {rows}
            </tbody>
          </table>
        <div style={{border: "1px solid black", width: "30%",height: "30px", marginLeft: "35%", marginTop: "15px"}}>
            {/*paginacion*/}
        </div>
      </div>
      <div style={{border: "1px solid black", width: "98%", margin: "1%"}}>
        <table style={{fontSize: "14px"}}>
          <thead>
            <tr>
              <th style={{width: "25%"}}></th>
              <th style={{width: "25%"}}>Total product in Stock</th>
              <th style={{width: "25%"}}>Total value in Stock</th>
              <th style={{width: "25%"}}>Average price in Stock</th>
            </tr>
          </thead>
          {
          /* categoryList.forEach((category) = { mock up of the stats functions
            <tr>
              <td>category</td>
              <td>category.count</td>
              <td>category.totalPrice</td>
              <td>product.avgPrice</td>
            </tr>
          }); */}
        </table>
      </div>
    </main>
  );
}
