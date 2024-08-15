import React, { useState } from 'react';

const Dropdown = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="relative">
            <button
                id="dropdownButton"
                onClick={toggleDropdown}
                className="h-10 z-50 px-8 py-[21px] text-white bg-[#1971c2] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm text-center inline-flex items-center dark:[#1971c2] dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
            >
                Select a tasks
                <svg
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>

            {/* Dropdown menu */}
            <div
                id="dropdownMenu"
                className={`absolute z-10 ${isDropdownOpen ? 'block' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-60 dark:bg-gray-700 dark:divide-gray-600`}
            >
                <ul
                    className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownButton"
                >
                    <li>
                        <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                            <div className="flex items-center h-5">
                                <input
                                    id="option1"
                                    name="radioOption"
                                    type="radio"
                                    value="option1"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    onChange={() => setSelectedOption('option1')}
                                    checked={selectedOption === 'option1'}
                                />
                            </div>
                            <div className="ms-2 text-sm">
                                <label
                                    htmlFor="option1"
                                    className="font-medium text-gray-900 dark:text-gray-300"
                                >
                                    <div>Question 1</div>
                                    <p
                                        id="option1-text"
                                        className="text-xs font-normal text-gray-500 dark:text-gray-300"
                                    >
                                        Some desc
                                    </p>
                                </label>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                            <div className="flex items-center h-5">
                                <input
                                    id="option2"
                                    name="radioOption"
                                    type="radio"
                                    value="option2"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    onChange={() => setSelectedOption('option2')}
                                    checked={selectedOption === 'option2'}
                                />
                            </div>
                            <div className="ms-2 text-sm">
                                <label
                                    htmlFor="option2"
                                    className="font-medium text-gray-900 dark:text-gray-300"
                                >
                                    <div>Question 2</div>
                                    <p
                                        id="option2-text"
                                        className="text-xs font-normal text-gray-500 dark:text-gray-300"
                                    >
                                        Some desc
                                    </p>
                                </label>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                            <div className="flex items-center h-5">
                                <input
                                    id="option3"
                                    name="radioOption"
                                    type="radio"
                                    value="option3"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    onChange={() => setSelectedOption('option3')}
                                    checked={selectedOption === 'option3'}
                                />
                            </div>
                            <div className="ms-2 text-sm">
                                <label
                                    htmlFor="option3"
                                    className="font-medium text-gray-900 dark:text-gray-300"
                                >
                                    <div>Question 3</div>
                                    <p
                                        id="option3-text"
                                        className="text-xs font-normal text-gray-500 dark:text-gray-300"
                                    >
                                        Some desc
                                    </p>
                                </label>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Dropdown;
