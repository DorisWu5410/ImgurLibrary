import React, {useEffect, useState } from 'react'
import SearchBar from './SearchBar';
import { Tabs, message, Row, Col, Button } from "antd";
import axios from "axios";
import PhotoGallery from "./PhotoGallery";
import { SEARCH_KEY, ClientId, ACCESS_TOKEN } from "../constants";
import Operation from 'antd/lib/transfer/operation';
import { ImgurClient } from 'imgur';


const { TabPane } = Tabs;

export default function Main(props) {
    const [posts, setPost] = useState([]);
    const [activeTab, setActiveTab] = useState("image");
    const [searchOption, setSearchOption] = useState({
        type: SEARCH_KEY.all,
        keyword: ""
    });

    const handleSearch = (option) => {
        const {type, keyword} = option;
        setSearchOption({type: type, keyword: keyword});
    };
    useEffect(() => {
        const {type, keyword} = searchOption;
        fetchPost(searchOption);
    }, [searchOption])


    // get post via api
    const fetchPost = (option) => {
        const { type, keyword } = option;
        let url = "";
        if(type === SEARCH_KEY.all){           //adjust url according to keyword
            // url = "https://api.imgur.com/3/gallery/hot/top/week/1?showViral=true&mature=true&album_previews=true";
            url= "	https://api.imgur.com/3/gallery/hot/time/1?showViral=bool"
        }
        else{
            url = `https://api.imgur.com/3/gallery/search/time/week/1?q=${keyword}`;
        }

        const opt = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `Client-ID ${ClientId}`                
            }
        };
    
        axios(opt)
            .then((response) => {
                if(response.status == 200){
                    console.log(Object.values(response.data)[0]);
                    setPost(Object.values(response.data)[0]);
                }
            })
            .catch((err) => {
                message.error("Fetch Post Failed!");
                console.log("fetch posts failed: ", err.message);
            })
    
    }

    const isImage = (item) => {
        const img = item.images;
        
        return img != null && img !== undefined && img[0].type.startsWith("image");
       
    }
    const isVideo = (item) => {
        const img = item.images;
        return img != null && img !== undefined && img[0].type.startsWith("video");
       
    }

  

    
    const renderPosts = (option) => {
        if(!posts || posts.length === 0){
            return <div>No data</div>
        }
        if(option === "image"){
           
            const imageArr = posts                  
                .filter(
                    isImage                     //filter image posts
                )   
                .map((item) => {
                    const title = item.title
                    const id = item.account_url
                    const img = item.images;
                    return {
                        id: id,
                        title: title,
                        src: img[0].link,
                        thumbnail: img[0].link,
                        thumbnailWidth: 300,
                        thumbnailHeight: 200
                    };
                    
                });
            console.log("imageArr: ", imageArr)
            return <PhotoGallery images = { imageArr }/>
        }
        
        else if(option === "video"){
            return (
                <Row gutter = {32} >
                {posts
                    .filter(isVideo)
                    .map((item) => (
                        <Col span={8} key={item.images[0].link}>
                          <video src={item.images[0].link} controls={true} className="video-block" width={400} height={300}/>
                          <p>
                             {item.id}: {item.title}
                          </p>
                        </Col>
                      ))}
                </Row>
            )
        }
    }

    // const showPost = (type) => {
    //     console.log("type -> ", type);
    //     setActiveTab(type);

    //     setTimeout(() => {                                          //handle time out request
    //         setSearchOption({type: SEARCH_KEY.all, keyword: ""});
    //     }, 3000);
    // };

    return (
        <div className='main'>
            <SearchBar handleSearch = {handleSearch}/>
            <div className='display'>
                <Tabs 
                    onChange = {(key) => setActiveTab(key)}
                    defaultActiveKey = "image"
                    activeKey = {activeTab}
                >
                    <TabPane tab="Images" key="image">
                        {renderPosts("image")}
                    </TabPane>

                    <TabPane tab="Videos" key="video">
                        {renderPosts("video")}
                    </TabPane>
                </Tabs>
                    
            </div>

        </div>
    );
}

