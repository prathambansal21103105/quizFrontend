import Card from "./Card";
const Tags=({clickHandler,topic,user,flag})=>{
    console.log("topic");
    console.log(topic);
    const items=[];
    for(const question in topic){
        items.push(topic[question]);
    }
    return(
    <div className="display">
      <div className='outer'>
      <h2>{topic[0].tag}</h2>
      <div className="topic">
      <ul>
      {items.map((element)=><li><Card key={element.id} id={element.id} clickHandler={clickHandler} question={element} user={user} flag={flag}/></li>)}
      </ul>
      </div>
      </div>
    </div>
    );
}
export default Tags;