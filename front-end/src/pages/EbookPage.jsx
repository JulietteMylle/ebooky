import { useParams } from 'react-router-dom';

import OneEbookInfo from '@/components/organisms/OneEbookInfo';

const EbookPage = () => {
    const { productId } = useParams();
    return (
        <>
            <OneEbookInfo />
        </>
    );
};

export default EbookPage;
