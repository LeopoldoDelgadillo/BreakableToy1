export default function Home() {
  return (
    <main>
      <div 
        className="SearchBlock"
        style={{border: "1px solid black", width: "450px", height: "135px", margin: "10px"}}>
        <form>
          <label htmlFor="name" style={{margin: "10px"}}>Name</label>
          <input type="text" id="name" name="name" style={{border: "1px solid black", margin: "10px"}}></input><br></br>
          <label htmlFor="categories" style={{margin: "10px"}}>Category</label>
          <select id="categories" name="categories" style={{border: "1px solid black", margin: "10px"}}></select><br></br>
          <label htmlFor="availability" style={{margin: "10px"}}>Availability</label>
          <select id="availability" name="availability" style={{border: "1px solid black", margin: "10px"}}></select>
          <input type="submit" value="Search" style={{border: "1px solid black", margin: "10px"}}></input>
        </form>
      </div>
    </main>
  );
}
