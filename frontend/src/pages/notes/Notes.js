import React, { useEffect, useState } from 'react';
import { FaPlus, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";
import { deleteNote } from '../../components/DeleteNote';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import UserLogout from '../../components/UserLogout';

function Notes() {
    let token = JSON.parse(localStorage.getItem('token'))

    const navigate = useNavigate()
    const [notes, setNotes] = useState([])
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [showAddform, setShowAddForm] = useState(false)

    const { decodedToken, isExpired } = useJwt(token);

    const getNotes = async () => {
        try {
            if (isExpired) {
                navigate('/login')
                console.log('token is expird')
                throw new Error()
            }
            if (!token) {
                navigate('/login')
                console.log('no token')
                throw new Error()
            }

            const res = await fetch('http://localhost:3001/api/notes/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            console.log(res)
            if (res.status === 200) {
                const data = await res.json()
                setNotes(data)
            }
            else {
                console.log('failed to fetch')
                throw new Error()
            }

        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {

        getNotes()

    }, [])
    return (
        <>
            <div className='flex items-center shadow  w-98  '>
                <Header />
                <FaPlus className='text-blue-800 text-2xl ml-auto mr-8 cursor-pointer' onClick={() => navigate('/newnote')} />
                <UserLogout />
            </div>
            <div className='mb-16 border-box '>

                {
                    notes ?
                        notes.map((note) => {
                            return (
                                <div className='bg-gray-200 shadow sm:w-2/3 md:w-1/2 w-4/5 p-6 my-6 mx-auto min-w-8 border-2 border-red rounded-lg '>
                                    <div className='flex justify-between'>
                                        <p className='font-bold text-md bg-gray-200'>{note.title}</p>
                                        <div className='flex gap-3'>
                                            <FaRegEdit className='text-blue-700 hover:text-xl cursor-pointer' onClick={(e) => {
                                                navigate(`/${note._id}`)
                                            }} />
                                            <FaRegTrashAlt className='text-red-700 hover:text-xl cursor-pointer' onClick={() => deleteNote(note._id)} />

                                        </div>
                                    </div>
                                    <p className='bg-gray-200 w-full' >{note.content}</p>
                                    <div className='flex justify-between'>
                                        <p className='text-gray-500 mt-4'>Created at : {note.createdAt}</p>
                                        <p className='text-gray-500 mt-4'>Updated at : {note.
                                            updatedAt}</p>
                                    </div>
                                </div>
                            )
                        })
                        : < div > no notes here </ div>

                }
            </div>

            <Footer />

        </>


    )
}

export default Notes


// add update note feature
// add Delete note feature  => done

//Get updated notes after create, update or delete