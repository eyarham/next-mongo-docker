'use client'
import React, { useEffect, useState } from 'react';

interface Resource {
    _id?: string;
    title?: string;
    url?: string;
}

const Page: React.FC = () => {
    const [resources, setResources] = useState<Array<Resource>>([]);
    const [newResource, setNewResource] = useState<Resource>({ title: "", url: "" });
    const [openedResource, setOpenedResource] = useState<Resource>();
    const [errorMessage, setErrorMessage] = useState<string>("");
    useEffect(() => {
        const eff = async () => {
            const response = await fetch(`/api`);//GET all
            if (!response.ok) {
                const responseJson = await response.json();
                const errorToSet = responseJson?.error;
                setErrorMessage(errorToSet)
            }
            else {
                const responseJson = await response.json();
                const resourcesToSet = responseJson?.resources;
                if (resourcesToSet) {
                    setResources(resourcesToSet);
                }
            }
        }
        eff();
    }, []);
    const refreshData = async () => {
        const response = await fetch(`/api`);//GET all
        if (response) {
            const responseJson = await response.json();
            const resourcesToSet = responseJson?.resources;
            if (resourcesToSet) {
                setResources(resourcesToSet);
            }
        }
    }
    const onAddNewResourceClick = async () => {
        if (newResource.title === "") {
            //print error message for title
        }
        else if (newResource.url === "") {
            //print error message for url
        }
        else {
            const response = await fetch(`/api`, { method: 'POST', body: JSON.stringify(newResource) });//POST
            if (!response.ok) {
                console.error(response.json())
            }
            else {
                setNewResource({ title: "", url: "" });
                await refreshData();
            }
        }
    }

    const onResourceTitleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setNewResource({ ...newResource, title: e.target.value })
    }

    const onResourceUrlChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setNewResource({ ...newResource, url: e.target.value })
    }
    const onDeleteClick = async (id: any) => {
        const response = await fetch(`/api/${id}`, { method: 'DELETE' });//DELETE
        if (!response.ok) { console.error(response.json()) }
        else {
            await refreshData();
        }
    }
    const onOpenClick = async (id: any) => {
        const response = await fetch(`/api/${id}`);//GET one
        if (!response.ok) { console.error(response.json()) }
        const resourceToSet = await response.json();
        setOpenedResource(resourceToSet);
    }
    return (
        <main className="flex flex-col items-center justify-between p-4">
            {resources && resources.length > 0 &&
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>title</th>
                                <th>url</th>
                                <th></th>
                                <th>delete?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map((resource, i) => {
                                return (<tr key={i}>
                                    <td>{resource.title}</td>
                                    <td>{resource.url}</td>
                                    <td>
                                        <input type='button' value="open" onClick={() => onOpenClick(resource._id)} />
                                    </td>
                                    <td className="float-right">
                                        <a href='#' onClick={() => onDeleteClick(resource._id)}>X</a>
                                    </td>
                                </tr>)
                            })}
                        </tbody>
                    </table>
                </div>
            }
            {openedResource &&
                <div>
                    <h2>{openedResource.title}</h2>
                    <h3>{openedResource.url}</h3>
                    <a href='#' onClick={() => onDeleteClick(openedResource._id)}>X</a>
                </div>}
            <form >
                Add new resource?
                <div>
                    <input name='title' id='title' placeholder='title' onChange={onResourceTitleChange} value={newResource?.title} />
                </div>
                <div>
                    <input name='url' id="url" placeholder='url' onChange={onResourceUrlChange} value={newResource?.url} />
                </div>
                <div>
                    <input type="button" value="add" onClick={onAddNewResourceClick} />
                </div>
            </form>
            {
                errorMessage &&
                <div style={{ color: "red" }}>
                    {errorMessage}
                </div>
            }
        </main>
    )
}

export default Page