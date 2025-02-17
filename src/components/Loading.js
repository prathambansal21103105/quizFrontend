import Navigation from "./Navigation";


const Loading=({user,reset})=>{
    return(
        <>
        <Navigation user={user} reset={reset}/>
        <div className="loading">
            <img src="https://miro.medium.com/v2/resize:fit:1400/1*e_Loq49BI4WmN7o9ItTADg.gif" alt="loading" height="100px"/>
        </div>
        </>
    );
}
export default Loading;