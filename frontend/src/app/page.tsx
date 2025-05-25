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
  var categories: Set<String>[] = [];
  var categoryStock = 0;
  var categoryTotalPrice = 0;
  const productRows = productInfo.map((product:any) => (
    categories.push(product.category),
    categoryStock = categoryStock + product.stock,
    categoryTotalPrice = categoryTotalPrice + (product.unitPrice * product.stock),
    <tr key={product.productId}>
      <td style={{ border: "1px solid gray", textAlign:"center"}}><input type="checkbox"></input></td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.category}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.name}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.unitPrice}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.expirationDate.toString()}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.stock}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}><button><strong>Edit</strong></button>/<button><strong>Delete</strong></button></td>
    </tr>
  ));
  const categoryRows = categories.map((category, index) => (
    <tr key={index}>
      <td style={{textAlign:"center"}}>{category}</td>
      <td style={{textAlign:"center"}}>{categoryStock}</td>
      <td style={{textAlign:"center"}}>{categoryTotalPrice}</td>
      <td style={{textAlign:"center"}}>{(categoryTotalPrice / categoryStock).toFixed(2)}</td>
    </tr>
  ));
  return (
    <main>
      <div
        className="SearchBlock"
        style={{ width: "98%", height: "180px", margin: "1%" }}>
        <form style={{border: "1px solid black", width:"100%", maxWidth: "500px", height:"100%", marginLeft: "auto",marginRight:"auto",textAlign:"center"}}>
          <label htmlFor="name" style={{width:"300px", marginLeft:"auto",marginRight:"auto",}}>Name</label>
          <input type="text" id="name" name="name" style={{ border: "1px solid black" , width:"35%", maxWidth: "200px", height: "25px", marginLeft:"2%", marginTop: "10px"}}></input><br></br>
          <label htmlFor="categories" style={{width:"300px", textAlign:"center"}}>Category</label>
          <select id="categories" name="categories" style={{ border: "1px solid black", width:"30%", maxWidth: "300px", height: "25px", marginLeft:"2%", marginTop: "10px"}}></select><br></br>
          <label htmlFor="availability" style={{width:"300px", textAlign:"center"}}>Availability</label>
          <select id="availability" name="availability" style={{border: "1px solid black", width:"28%", maxWidth: "500px",height:"25px", marginLeft:"2%", marginTop: "10px"}}></select><br></br>
          <input type="submit" value="Search" style={{border: "1px solid black",width: "120px", height:"25px", marginTop: "10px", textAlign:"center", marginLeft: "auto",marginRight:"auto"}}></input>
        </form>
      </div>
      <div style={{width:"120px", marginLeft: "auto", marginRight: "auto",marginTop: "10px", marginBottom: "10px", textAlign: "center"}}>
        <input 
          type="submit" 
          value="New product" 
          style={{border: "1px solid black",width:"120px"}}>
        </input>
      </div>
      <div>
          <table style={{border: "1px solid black", width: "98%",maxWidth:"1000px", marginLeft: "auto",marginRight: "auto", fontSize: "14px"}}>
            <thead style={{border: "1px solid black"}}>
              <tr>
                <th scope="col" style={{border: "1px solid black", width: "5%",textAlign:"center"}}><input type="checkbox"></input></th>
                <th scope="col" style={{border: "1px solid black", width: "20%", margin: "10px", textAlign:"center"}}>Category&lt;&gt;</th>
                <th scope="col" style={{border: "1px solid black", width: "25%", margin: "10px", textAlign:"center"}}>Name&lt;&gt;</th>
                <th scope="col" style={{border: "1px solid black", width: "7.5%", margin: "10px", textAlign:"center"}}>Price&lt;&gt;</th>
                <th scope="col" style={{border: "1px solid black", width: "25%", margin: "10px", textAlign:"center"}}>Expiration Date&lt;&gt;</th>
                <th scope="col" style={{border: "1px solid black", width: "7.5%", margin: "10px", textAlign:"center"}}>Stock&lt;&gt;</th>
                <th scope="col" style={{border: "1px solid black", width: "20%", margin: "10px", textAlign:"center"}}>Actions&lt;&gt;</th>
              </tr>
            </thead>
            <tbody style={{border: "1px solid black", width: "98%", fontSize: "14px"}}>
                {productRows}
            </tbody>
          </table>
        <div style={{border: "1px solid black", width: "50%", maxWidth: "300px" , height: "25px", marginLeft: "auto", marginRight: "auto", marginTop: "10px", textAlign: "center"}}>
            {/*paginacion*/}
        </div>
      </div>
      <div>
        <table style={{border: "1px solid black", width: "98%", maxWidth:"1000px", marginTop: "10px", marginLeft: "auto", marginRight: "auto", textAlign: "center", fontSize: "13px"}}>
          <thead>
            <tr>
              <th style={{width: "22%",textAlign:"center"}}></th>
              <th style={{width: "22%",textAlign:"center"}}>Total product in Stock</th>
              <th style={{width: "22%",textAlign:"center"}}>Total value in Stock</th>
              <th style={{width: "22%",textAlign:"center"}}>Average price in Stock</th>
            </tr>
          </thead>
          <tbody>
            {categoryRows}
          </tbody>
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
