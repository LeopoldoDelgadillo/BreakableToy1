'use client'
import React, { useEffect, useState } from "react";

interface Product {
        name: string;
        category: string;
        unitPrice: number;
        stock: number;
        expirationDate: Date;
        creationDate: Date;
        lastUpdate: Date;
        id: number;
      }

function getProducts(): Promise<Product[]> {
  const headers: Headers = new Headers()
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')
  headers.set('X-Custom-Header', 'CustomValue')
  const request = new Request(`/api/products.json`, {
    method: 'GET',
    headers: headers
  })
  return fetch(request)
    .then(res => res.json())
    .then(res => {
      return res as Product[]
  })
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  // Build table rows with a for loop
  const rows = [];
    for(let i=0; i<products.length; i++){
      const product = products[i];
      rows.push(// mock up of the product list
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
      );
    };
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
