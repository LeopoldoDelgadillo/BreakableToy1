'use client';
import { maxHeaderSize } from "http";
import { useEffect, useState } from "react";
import Select from "react-select";
var pageTable=0
var sortString: string = "";


export default function Home() {

  /** Function that fetches the list of products 
   * that are going to appear on the table. */
  const[productList, setProductList] = useState([]);
  const[productPageCount, setProductPageCount] = useState(0);
  const[productCurrentPage, setProductCurrentPage] = useState(0);
  const getProducts = async (page: number, sort?: string, searchName?:string, searchCategory?: Array<string>, searchAvailability?: string) =>{
    try{
      let url = `http://localhost:9090/products?page=${page}`;
      pageTable=page;
      if (sort) {
        url += `&sort=${sort}`;
        sortString = sort;}
      if (searchName !== undefined && searchName !== "") url += `&searchName=${searchName}`;
      if (searchCategory !== undefined && searchCategory.length) url += `&searchCategory=${searchCategory}`;
      searchAvailability !== undefined && searchAvailability !=="" ? url += `&searchAvailability=${searchAvailability}` : url += "&searchAvailability=All";
      console.log("Fetching products from URL:", url);
      const response = await (await fetch(url)).json();
      console.log("Fetched products:", response);
      setProductList(response.pageList);
      setProductPageCount(response.pageCount);
      setProductCurrentPage(response.currentPage);
      pagination()
      getProductStats();
    }catch (error){
      console.error("Error fetching products:", error);
    }
  }

  
  /** Function that uses the fetched list of products
   * and maps it to the table in HTML. */
  const productRows = productList.map((product:any) => {
    return (
    <tr key={product.productId}>
      <td style={{ border: "1px solid gray", textAlign:"center"}}><input type="checkbox"></input></td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.category}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.name}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.unitPrice}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.expirationDate.toString()}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.stock}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}><button><strong>Edit</strong></button>/<button><strong>Delete</strong></button></td>
    </tr>
    );
  });

  /** Function that fetches the complete list of products in the database,
   * regardless of the page and search parameters, for use 
   * on the category statistics table. */
  const[productFullList, setProductFullList] = useState([]);
  const getProductStats = async () =>{
    try{
      let url = "http://localhost:9090/products?page=0&searchAvailability=All";
      const response = await (await fetch(url)).json();
      console.log("Fetched products for category stats:", response);
      setProductFullList(response.source);
    }catch (error){
      console.error("Error fetching products for category stats:", error);
    }
    
  }
  
  /** Interface for creating models that keep track of the statistics 
   * of each category. */
  interface categoryStats {
    name: string,
    totalStock: number,
    totalPrice: number
  }

  /** Object that uses the fetched full list of products and creates
   * the models through the interface categoryStats. */
  let categories = new Map<string, categoryStats>();
  const categoriesMapping = productFullList.map((product:any) => {
    const categoryStat = categories.get(product.category);
    if (!categoryStat) {
      console.log("Adding category:", product.category);
      categories.set(product.category, {
        name: product.category,
        totalStock: product.stock,
        totalPrice: product.unitPrice * product.stock
      });
    }
    else {
      console.log("Updating category:", product.category);
      console.log(product.category,"from", categoryStat.totalStock,"to", categoryStat.totalStock + product.stock);
      categoryStat.totalStock += product.stock;
      categoryStat.totalPrice += product.unitPrice * product.stock;
    }
  });

  /** Run categoriesMapping, and with the models created for every category
   * we map them into the table in HTML. */
  categoriesMapping;
  const categoryRows = Array.from(categories.values()).map((categoryStat: categoryStats) => {
    console.log("Adding rows:", categories);
    return(
      <tr key={categoryStat.name}>
        <td style={{textAlign:"center"}}>{categoryStat.name}</td>
        <td style={{textAlign:"center"}}>{categoryStat.totalStock}</td>
        <td style={{textAlign:"center"}}>{categoryStat.totalPrice}</td>
        <td style={{textAlign:"center"}}>{(categoryStat.totalPrice / categoryStat.totalStock).toFixed(2)}</td>
      </tr>
    );
  });

  /** Run the function to fetch the products for the main table. */
  useEffect(() => {
    getProducts(pageTable);
  }, []);
  
  /** Function that handles the pagination buttons below the table */
  const pagination = () => {
    const pages = [];
    for (let i = 0; i < productPageCount; i++) {
      pages.push(
        i === productCurrentPage ? (
        <button key={i} onClick={() => getProducts(i,sortString)} style={{color: "blue", fontWeight: "bold", WebkitTextFillColor: "blue"}}>
          {i + 1}
        </button>
        ) : (
          <button key={i} onClick={() => getProducts(i,sortString)}>
            {i + 1}
          </button>
        )
      );
    }
    return pages;
  }

  /** Object used to return the categories that exist. */
  const getCategories = Array.from(categories.values()).map((category) => {
    return (
      <option key={category.name} value={category.name}>
        {category.name}
      </option>
    );
  });
  
  /** Code that handles the parameters and style for the multi-select 
   * library. */
  const categoryOptions = Array.from(categories.values()).map(category => ({
    value: category.name,
    label: category.name
  }));
  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      border: "1px solid black",
      width: "100%",
      maxWidth: "500px",
      height: "25px",
      maxHeaderSize:"25px",
      marginLeft: "2%",
      marginTop: "10px"
    }),
  };

  /** Functions that handle the search parameters of the Search Block. */
  const [nameValue, setNameValue] = useState("");
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(e.target.value);
    console.log("search name set to:", nameValue)
  };
  const [categoryValue, setCategoryValue] = useState<{ value: string; label: string }[]>([]);
  const handleCategoryChange = (selected: any) => {
    setCategoryValue(selected || []);
    console.log("search category(ies) set to:", selected ? selected.map((s: any) => s.value) : []);
  };
  const [availabilityValue, setAvailabilityValue] = useState("");
  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAvailabilityValue(e.target.value);
    console.log("search availability set to:", availabilityValue)
  };

  /** function that handles the Search button and does the searching. */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("fetching product list with the following parameters: Name=",nameValue," Category(ies)=",categoryValue," Availability=",availabilityValue)
    const selectedCategoryNames = categoryValue.map(c => c.value);
    getProducts(pageTable, sortString, nameValue, selectedCategoryNames, availabilityValue);
  };

  /** Variables and function for the New Product Modal. */
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  /**Function that handles the modal creation and options. */
  const productModal = () => (
      <div 
        className="modal"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          {
          <div style={{ background: "#fff", padding: 24, borderRadius: 8, minWidth: 300 }}>
            <button onClick={closeModal} style={{ float: "right" }}>X</button>
            <form onSubmit={handleModalSubmit}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" style={{ border:"1px solid black", marginTop:"25px", marginLeft:"36px", width:"146.5px", height:"25px" }} required /><br></br>
              <label htmlFor="category">Category</label>
              {!showCategoryInput ? (
              <select id="category" name="category" style={{ border:"1px solid black", marginTop:"10px", marginLeft:"14px", width:"146.5px", height:"25px" }} required>
                {getCategories}
              </select>
              ) : (
              <input id="category" name="category" style={{ border:"1px solid black", marginTop:"10px", marginLeft:"14px", width:"146.5px", height:"25px" }} />
              )}
              <label>
                <input 
                  type="checkbox" 
                  id="check" 
                  checked={showCategoryInput}
                  onChange={handleCheckChange}
                  style={{marginLeft:"10px",marginRight:"3px"}}/>
                  New category
              </label><br></br>
              <label htmlFor="unitPrice">Unit Price</label>
              <input type="number" id="unitPrice" name="unitPrice" style={{ border:"1px solid black", marginTop:"10px", marginLeft:"10px", width:"146px", height:"25px" }} required /><br></br>
              <label htmlFor="stock">Stock</label>
              <input type="number" id="stock" name="stock" style={{ border:"1px solid black", marginTop:"10px", marginLeft:"40px", width:"146px", height:"25px" }} required /><br></br>
              <label htmlFor="expirationDate">Expiration Date</label>
              <input type="date" id="expirationDate" name="expirationDate" style={{ border:"1px solid black", marginTop:"10px", marginLeft:"10px" }} required /><br></br>
              <button type="submit" style={{ border:"1px solid black" ,width:"50px", marginTop:"10px"}}>Save</button>
            </form>
          </div>
          }
      </div>
  )

  /**Function that handles the Save button of the modal and sends
   * the new product information to the database. */
  const handleModalSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get("name") as string;
      const category = formData.get("categorySelect") as string;
      const unitPrice = parseFloat(formData.get("unitPrice") as string);
      const stock = parseInt(formData.get("stock") as string, 10);
      const expirationDate = formData.get("expirationDate") as string;

      console.log("Submitting product:", { name, category, unitPrice, stock, expirationDate });
  }

  /** Variable and function to handle the new category check on the modal. */
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const handleCheckChange = () => {
    setShowCategoryInput((prev) => !prev);
  };
  
  /** HTML code of the app that renders on http://localhost:8080 */
  return (
    <main>
      <div
        className="SearchBlock"
        style={{ width: "98%", height: "165px", marginLeft: "1%", marginRight:"1%", marginTop:"10px" }}>
        <form onSubmit={handleSearchSubmit} style={{border: "1px solid black", width:"100%", maxWidth: "500px", height:"100%", marginLeft: "auto",marginRight:"auto",textAlign:"center"}}>
          <label htmlFor="name" style={{width:"300px", marginLeft:"auto",marginRight:"auto"}}>Name</label>
          <input type="text" id="name" name="name" value={nameValue} onChange={handleNameChange} style={{ border: "1px solid black" , width:"35%", maxWidth: "200px", height: "25px", marginLeft:"2%", marginTop: "10px"}}></input><br></br>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <label htmlFor="categories" style={{width:"80px", textAlign:"center"}}>Category</label>
            <Select isMulti maxMenuHeight={150} options={categoryOptions} value={categoryValue} onChange={handleCategoryChange} placeholder="Select categories..." styles={customSelectStyles}></Select><br></br>
          </div>
          <label htmlFor="availability" style={{width:"300px", textAlign:"center"}}>Availability</label>
          <select id="availability" name="availability" value={availabilityValue} onChange={handleAvailabilityChange} style={{ border: "1px solid black", width:"28%", maxWidth: "500px",height:"25px", marginLeft:"2%", marginTop: "10px"}}>
            <option value="All">All</option>  
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select><br></br>
          <button type="submit" style={{border: "1px solid black",width: "120px", height:"25px", marginTop: "10px", textAlign:"center", marginLeft: "auto",marginRight:"auto"}}>Search</button>
        </form>
      </div>
      <div style={{width:"120px", marginLeft: "auto", marginRight: "auto",marginTop: "10px", marginBottom: "10px", textAlign: "center"}}>
        <button 
          type="button"
          style={{border: "1px solid black",width:"120px"}}
          onClick={openModal}>
            New Product
        </button>
      </div>
      {showModal && productModal()}
      <div>
          <table style={{border: "1px solid black", width: "98%",maxWidth:"1000px", marginLeft: "auto",marginRight: "auto", fontSize: "14px"}}>
            <thead style={{border: "1px solid black"}}>
              <tr>
                <th scope="col" style={{border: "1px solid black", width: "5%",textAlign:"center"}}><input type="checkbox"></input></th>
                <th scope="col" style={{border: "1px solid black", width: "20%", margin: "10px", textAlign:"center"}}><button onClick={() => getProducts(pageTable,"category")}>Category&lt;&gt;</button></th>
                <th scope="col" style={{border: "1px solid black", width: "25%", margin: "10px", textAlign:"center"}}><button onClick={() => getProducts(pageTable,"name")}>Name&lt;&gt;</button></th>
                <th scope="col" style={{border: "1px solid black", width: "7.5%", margin: "10px", textAlign:"center"}}><button onClick={() => getProducts(pageTable,"unitPrice")}>Price&lt;&gt;</button></th>
                <th scope="col" style={{border: "1px solid black", width: "25%", margin: "10px", textAlign:"center"}}><button onClick={() => getProducts(pageTable,"expirationDate")}>Expiration Date&lt;&gt;</button></th>
                <th scope="col" style={{border: "1px solid black", width: "7.5%", margin: "10px", textAlign:"center"}}><button onClick={() => getProducts(pageTable,"stock")}>Stock&lt;&gt;</button></th>
                <th scope="col" style={{border: "1px solid black", width: "20%", margin: "10px", textAlign:"center"}}>Actions&lt;&gt;</th>
              </tr>
            </thead>
            <tbody style={{border: "1px solid black", width: "98%", fontSize: "14px"}}>
                {productRows}
            </tbody>
          </table>
        <div style={{border: "1px solid black", width: "50%", maxWidth: "300px" , height: "25px", marginLeft: "auto", marginRight: "auto", marginTop: "10px", textAlign: "center"}}>
            {pagination()}
        </div>
      </div>
      <div>
        <table style={{border: "1px solid black", width: "98%", maxWidth:"1000px", maxHeight:"200px", marginTop: "10px", marginLeft: "auto", marginRight: "auto", textAlign: "center", fontSize: "13px"}}>
          <thead>
            <tr>
              <th style={{width: "22%",textAlign:"center"}}>Category</th>
              <th style={{width: "22%",textAlign:"center"}}>Total product in Stock</th>
              <th style={{width: "22%",textAlign:"center"}}>Total value in Stock</th>
              <th style={{width: "22%",textAlign:"center"}}>Average price in Stock</th>
            </tr>
          </thead>
          <tbody>
            {categoryRows}
          </tbody>
        </table>
      </div>
    </main>
    
  );
}

