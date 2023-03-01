import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Equipment from '../equipment';

const Medications = () => {
    const parentCategories = useSelector((state) => state?.equipment?.parentCategories);
    const loading = useSelector((state) => state?.equipment?.loading);
    if (!parentCategories?.includes('medication') && !loading) {
        return <Navigate to='/dashboard' />;
    }

    return <Equipment medication/>
}

export default Medications