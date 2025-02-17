import Navigation from "./Navigation";

const Profile=({user,reset,leetData,codeData,cfData})=>{
    console.log(user);
    console.log(leetData);
    const imgUrl=leetData["data"]["data"]["matchedUser"]["profile"]["userAvatar"];
    console.log(imgUrl);
    const leetcodeLogo="https://assets.leetcode.com/static_assets/public/images/LeetCode_logo_rvs.png";
    const cfLogo="https://pruthvi02.files.wordpress.com/2020/10/code.jpg";
    const cfRank=codeData["result"]["0"]["rank"];
    const rank=cfRank.charAt(0).toUpperCase()+cfRank.substring(1);
    const cfRating=codeData["result"]["0"]["rating"];
    const cfName=codeData["result"]["0"]["handle"];
    const cfFriends=codeData["result"]["0"]["friendOfCount"];
    const cfCity=codeData["result"]["0"]["city"];
    const cfOrganization=codeData["result"]["0"]["organization"];
    const cfEmail=codeData["result"]["0"]["email"];
    const badges=leetData["data"]["data"]["matchedUser"]["badges"];
    // const photo=codeData["result"]["0"]["avatar"];
    const rating=leetData["data"]["data"]["userContestRanking"]["rating"];
    console.log(typeof rating);
    console.log(badges);
    console.log(codeData);
    console.log(leetData);
    return(
    <>
    <Navigation user={user} reset={reset}/>
    <main>
        <div className="userBoxMain">
            
            <div className="info">
                <div>
                    <span className={rank}>{rank}</span>
                    <h1>
                    <span className={rank}>
                    {cfName}
                    </span>
                    </h1>
                    <div>
                        <div><a href={leetData["data"]["data"]["matchedUser"]["githubUrl"]}>{leetData["data"]["data"]["matchedUser"]["profile"]["realName"]}, {cfCity}, {leetData["data"]["data"]["matchedUser"]["profile"]["countryName"]}</a></div>
                        <div className="lastLine"><span className="grey">From </span>{cfOrganization}</div>
                    </div>
                    <div><span className="grey">Contest rating:</span> <span className={rank}>{cfRating}</span></div>
                    <div><span className="grey">Friends:</span> {cfFriends}</div>
                    <span className="grey">Mail:</span> {cfEmail}
                </div>
            </div>
            <div className="forImage">
            <img className="userImage" src={imgUrl} alt="userImage" />
            </div>
            
        </div>
        <div className="userBox1">
        {badges["0"] && <img className="badge" src={badges["0"]["medal"]["config"]["iconGif"]} alt="badge"/>}
        {badges["1"] && <img className="badge" src={badges["1"]["medal"]["config"]["iconGif"]} alt="badge"/>}
        </div>
        <div className="userBox1">
        {badges["2"] && <img className="badge" src={badges["2"]["medal"]["config"]["iconGif"]} alt="badge"/>}
        {badges["3"] && <img className="badge" src={badges["3"]["medal"]["config"]["iconGif"]} alt="badge"/>}
        {badges["4"] && <img className="badge" src={badges["4"]["medal"]["config"]["iconGif"]} alt="badge"/>}
        {badges["5"] && <img className="badge" src={badges["5"]["medal"]["config"]["iconGif"]} alt="badge"/>}
        </div>
        <div className="userBox">
        <div className="leetcode">
            <img className="leetLogo" src={leetcodeLogo} alt="logo"/>
            <div>
                <span className="green">Easy <span className="bold">{leetData["data"]["data"]["matchedUserStats"]["submitStats"]["acSubmissionNum"]["1"]["count"]}</span></span>
                <span className="yellow">Medium <span className="bold">{leetData["data"]["data"]["matchedUserStats"]["submitStats"]["acSubmissionNum"]["2"]["count"]}</span></span>
                <span className="red">Hard <span className="bold">{leetData["data"]["data"]["matchedUserStats"]["submitStats"]["acSubmissionNum"]["3"]["count"]}</span></span>
                <span className="white">All <span className="bold">{leetData["data"]["data"]["matchedUserStats"]["submitStats"]["acSubmissionNum"]["0"]["count"]}</span></span>
                <span className="rating">Rating <span className="bold">{Math.ceil(rating)}</span></span>
                Top <span className="bold">{leetData["data"]["data"]["userContestRanking"]["topPercentage"]}%</span>
            </div>
        </div>
        <div className="space">
        <div className="cf">
            <img className="logo" src={cfLogo} alt="logo"/>
            <div>
            <span className={"black block"}>Contest Rating <span className="bolder">{cfRating}</span></span>
            <span className="black"> Total Submissions <span className="bolder">{cfData["totalSubmissions"]}</span></span>
            <span className="cfGreen"> Correct Submissions <span className="bolder">{cfData["correctSubmissions"]}</span></span>
            <span className="cfRed">Problems Solved <span className="bolder">{cfData["questionsSolved"]}</span></span>
            <span className={rank}> Contest Rank <span className="bolder">{rank}</span> </span>
            </div>
        </div>
        </div>
        </div>
    </main>
    </>    
    );
}
export default Profile;