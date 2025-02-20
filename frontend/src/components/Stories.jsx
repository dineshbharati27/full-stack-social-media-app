import React from 'react';

const stories = [
  { id: 1, name: 'rutuja_cha...', img: 'path_to_image1' },
  { id: 2, name: 'aditii_166', img: 'path_to_image2' },
  { id: 3, name: 'paulamee__', img: 'path_to_image3' },
  { id: 4, name: '__mr.venkyy', img: 'path_to_image4' },
  { id: 5, name: 'i_kunaluda...', img: 'path_to_image5' },
  { id: 6, name: '_its_hire_009', img: 'path_to_image6' },
  { id: 7, name: 'rau__borse', img: 'path_to_image7' },
  { id: 8, name: 'crazy_than_u', img: 'path_to_image8' },
  { id: 9, name: 'mrudula411', img: 'path_to_image9' },
  { id: 10, name: 'siddhant___', img: 'path_to_image10' },
  { id: 11, name: 'mrudula411', img: 'path_to_image11' },
  { id: 12, name: 'mrudula411', img: 'path_to_image12' },
  { id: 13, name: 'mrudula411', img: 'path_to_image13' },
  { id: 14, name: 'mrudula411', img: 'path_to_image14' },
  { id: 15, name: 'mrudula411', img: 'path_to_image15' },
  { id: 16, name: 'mrudula411', img: 'path_to_image16' },
  { id: 17, name: 'mrudula411', img: 'path_to_image17' },
  { id: 18, name: 'mrudula411', img: 'path_to_image18' },
  { id: 19, name: 'mrudula411', img: 'path_to_image19' },
  { id: 20, name: 'mrudula411', img: 'path_to_image20' },
];

const Stories = () => {
  return (
    <div className="flex space-x-3 overflow-x-scroll hide-scrollbar mt-5 md:mt-2 py-2 sm:py-3">
      {stories.map(story => (
        <div key={story.id} className="flex flex-col items-center">
          <img src={story.img} 
                alt={story.name} 
                className="w-12 h-12 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full border-2 border-pink-500 p-1" />
          <p className="text-white text-xs sm:text-sm mt-0.5 leading-none">{story.name}</p>
        </div>
      ))}
    </div>


  );
};

export default Stories;