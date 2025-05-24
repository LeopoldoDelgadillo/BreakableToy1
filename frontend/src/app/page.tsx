'use client';
import { useEffect, useState } from "react";

export default function Home() {
  const[productInfo, setProductInfo] = useState([]);
  useEffect(() => {
    const getProducts = async () =>{
      const query = fetch('http://localhost:8080/products?page=0');
      const response = (await query).json();
    }
    getProducts();
  }, []);

  const rows = [];
    rows.push(
      productInfo.map((product:any) => (
      <div key={product.productId}>
          <tr>
            <td><input type="checkbox"></input></td>
            <td>{product.category}</td>
            <td>{product.name}</td>
            <td>{product.unitPrice}</td>
            <td>{product.expirationDate.toString()}</td>
            <td>{product.stock}</td>
            <td>
              <button>Edit</button>/<button>Delete</button>
            </td>
          </tr>
      </div>
  )));
      
  return (
     
    <main>
      <div 
        className="SearchBlock"
        style={{border: "1px solid black", width: "98%", height: "135px", margin: "1%"}}>
        <form>
          <label htmlFor="name" style={{margin: "10px"}}>Name</label>
          <input type="text" id="name" name="name" style={{border: "1px solid black",width: "300px", height:"20px", margin: "10px"}}></input><br></br>
          <label htmlFor="categories" style={{margin: "10px"}}>Category</label>
          <select id="categories" name="categories" style={{border: "1px solid black",width: "150px", height:"20px", margin: "10px"}}></select><br></br>
          <label htmlFor="availability" style={{margin: "10px"}}>Availability</label>
          <select id="availability" name="availability" style={{border: "1px solid black",width: "150px", height:"20px", margin: "10px"}}></select>
          <input type="submit" value="Search" style={{border: "1px solid black",width: "80px", height:"20px", margin: "10px"}}></input>
        </form>
      </div>
      <div>
        <input 
          type="submit" 
          value="New product" 
          style={{border: "1px solid black", width: "120px", margin: "10px"}}>
        </input>
      </div>
      <div>
          <table style={{border: "1px solid black", width: "98%", margin: "1%"}}>
            <thead style={{border: "1px solid black", width: "98%", fontSize: "14px"}}>
              <tr>
                <th scope="col" style={{border: "1px solid black", width: "5%", margin: "10px"}}><input type="checkbox"></input></th>
                <th scope="col" style={{border: "1px solid black", width: "20%", margin: "10px"}}>Category&lt;&gt;</th>
                <th scope="col" style={{border: "1px solid black", width: "25%", margin: "10px"}}>Name&lt;&gt;</th>
                <th scope="col" style={{border: "1px solid black", width: "10%", margin: "10px"}}>Price&lt;&gt;</th>
                <th scope="col" style={{border: "1px solid black", width: "25%", margin: "10px"}}>Expiration Date&lt;&gt;</th>
                <th scope="col" style={{border: "1px solid black", width: "15%", margin: "10px"}}>Stock&lt;&gt;</th>
                <th scope="col" style={{border: "1px solid black", width: "10%", margin: "10px"}}>Actions&lt;&gt;</th>
              </tr>
            </thead>
              <tbody>
                {rows}
              </tbody>
          </table>
        <div style={{border: "1px solid black", width: "30%",height: "30px", marginLeft: "35%", marginTop: "15px"}}>
            {/*paginacion*/}
        </div>
      </div>
      <div style={{border: "1px solid black", width: "98%", margin: "1%"}}>
        <table style={{fontSize: "14px"}}>
          <tr>
            <th style={{width: "25%"}}></th>
            <th style={{width: "25%"}}>Total product in Stock</th>
            <th style={{width: "25%"}}>Total value in Stock</th>
            <th style={{width: "25%"}}>Average price in Stock</th>
          </tr>
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
