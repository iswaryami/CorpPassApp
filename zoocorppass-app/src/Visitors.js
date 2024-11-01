import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CreateVisitor from './CreateVisitor';
import VisitorList from './VisitorList';
import UpdateVisitor from './UpdateVisitor';

const Visitors = () => {
    return (
        <div>
            <h2>Visitors Page</h2>
            <nav>
                <ul>
                    <li>
                        <Link to="create">Create Visitor</Link>
                    </li>
                    <li>
                        <Link to="view">View Visitor</Link>
                    </li>
                    <li>
                        <Link to="update">Update Visitor</Link>
                    </li>
                </ul>
            </nav>


            <Routes>
                <Route path="create" element={<CreateVisitor />} />
                <Route path="view" element={<VisitorList />} />
                <Route path="update" element={<UpdateVisitor />} />
            </Routes>
        </div>
    );
};

export default Visitors;