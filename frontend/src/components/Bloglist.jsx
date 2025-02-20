import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllBlogs } from "../store/slices/blogSlice";
import { getAllUsers } from "../store/slices/authSlice";
import Stories from "./Stories";
import BlogCard from "./BlogCard";
import StoriesBar from "./StoryBar";
import StoryViewer from "./StoryViewer";

const BlogList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, isLoading } = useSelector((state) => state.blog);
  const { allUsers, isLoading: usersLoading } = useSelector((state) => state.auth);
  const { stories, isLoading: storiesLoading } = useSelector((state) => state.story);
  const [selectedStories, setSelectedStories] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  useEffect(() => {
    // Only fetch if we don't already have the data
    if (!blogs.length) {
      dispatch(getAllBlogs());
    }
    if (!allUsers?.length) {
      dispatch(getAllUsers());
    }
  }, []); 

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Show loading state while either blogs or users are loading
  if ((isLoading && !blogs.length) || (usersLoading && !allUsers?.length)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Check if we have both blogs and users data
  if (!blogs || !allUsers) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">No data available</div>
      </div>
    );
  }

  // Calculate indexes for pagination
  // const indexOfLastBlog = currentPage * blogsPerPage;
  // const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  // const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  // const totalPages = Math.ceil(blogs.length / blogsPerPage);



  return (
    <>
      {selectedStories ? (
        <StoryViewer
        stories={selectedStories.stories}
        onClose={() => setSelectedStories(null)}
        initialUserIndex={selectedStories.initialUserIndex}
        />
      ) : (
        <div className="min-h-screen bg-gray-50">
          <div className="mx-auto mt-5 md:mt-0 px-3 sm:px-1 lg:px-8">
            {/* Stories Bar */}
            <div className="mt-0 md:mt-5 sm:px-1 md:px-8 lg:px-12 max-w-3xl mx-auto">
            <StoriesBar onStoryClick={(userStories, index) => {
                // Pass the entire stories array and the selected user's index
                const userIndex = stories.findIndex(story => story.user._id === userStories.user._id);
                setSelectedStories({
                  stories: stories,
                  initialUserIndex: index
                });
              }} />
            </div>

            {/* Blog List */}
            <div className="mt-5 sm:px-1 md:px-8 lg:px-12 max-w-3xl mx-auto flex flex-col gap-4">
              {blogs.map((blog) => {
                const user = allUsers.find(user => user._id === blog.userId.toString());
                return (
                  <BlogCard 
                    key={blog._id} 
                    blog={blog} 
                    user={user} 
                    allUsers={allUsers}
                  />
                );
              })}
            </div>

            {/* Pagination Controls */}
            {/* {totalPages > 1 && (
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">{currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )} */}
          </div>
        </div>
      )}
    </>
  );
};

export default BlogList;
