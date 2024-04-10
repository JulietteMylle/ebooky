import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button as ButtonCn } from '../ui/button';

const Button = ({ content, icon }) => {
    return (
        <div>
            <ButtonCn>
                {content}
                {icon && <ShoppingCart className="ml-2" />}
            </ButtonCn>
        </div>
    );
};

export default Button;
