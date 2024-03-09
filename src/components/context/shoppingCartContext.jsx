import { createContext, useContext, useState } from "react";
import { shirts, others } from "../../components/data/productsData";
import PropTypes from "prop-types";
import ShoppingCart from "../ShoppingCart/ShoppingCart";
import useLocalStorage from "../hooks/useLocalStorage";

const shoppingCartContext = createContext({});

// eslint-disable-next-line react-refresh/only-export-components
export function useShoppingCart() {
    return useContext(shoppingCartContext)
}

export function ShoppingCartProvider({ children }) {
    const [cartItems, setCartItems] = useLocalStorage("shopping-cart", []);
    const [listCart, setListCart] = useLocalStorage("list-cart", []);
    const [isOpen, setIsOpen] = useState(false);

    // principais funções do carrinho de compras
    function getItemQuantity(id) {
        return cartItems.find(item => item.id == id)?.quantity || 0;
    }

    function increaseCartQuantity(id, quantity, size) {
        setCartItems(currentItems => {
            // Verifica se já existe um item no carrinho com o mesmo ID e tamanho
            const existingItemIndex = currentItems.findIndex(item => item.id === id && item.size === size);
    
            // Se não houver um item com o mesmo ID e tamanho no carrinho
            if (existingItemIndex === -1) {
                // Adiciona um novo item ao carrinho com o ID, quantidade e tamanho fornecidos
                return [...currentItems, { id, quantity, size }];
            } else {
                // Se já houver um item com o mesmo ID e tamanho no carrinho
                // Atualiza apenas a quantidade do item existente
                const updatedItems = [...currentItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + quantity
                };
                return updatedItems;
            }
        });
    
    }

    function decreaseCartQuantity(id) {
        setCartItems(currentItems => {
            if (cartItems.find(item => item.id === id)?.quantity === 1) {
                return currentItems.filter(item => item.id !== id)
            } else {
                return currentItems?.map(item => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity - 1 }
                    } else {
                        return item
                    }
                })
            }
        })
    }

    function removeFromCart(id) {
        const STORAGE_KEY = 'list-cart';

        const storedCart = localStorage.getItem(STORAGE_KEY);
        const cartItems = JSON.parse(storedCart);
        const newCartItems = cartItems.filter(item => item.id !== id)

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newCartItems));

        setCartItems((currentItems) => currentItems.filter(item => item.id !== id))
        setListCart(newCartItems);
    }

    const cartQuantity = cartItems?.reduce((quantity, item) => item.quantity + quantity, 0) || 0;

    function listShoppingCart(id, productType) {
        // Decide de qual array de produtos fazer a busca com base no tipo
        const productsArray = productType === 'shirts' ? shirts : (productType === 'others' ? others : []);
        // Encontra o item no array de produtos
        const selectedItem = productsArray.find(item => item.id === id);
        
        if (!listCart.some(item => item.id === selectedItem.id)) {
            setListCart((currentItems) => [...currentItems, selectedItem])
        }
    }

    const openCart = () => setIsOpen(true);

    const closeCart = () => setIsOpen(false);

    return (
        <shoppingCartContext.Provider value={{
            getItemQuantity,
            increaseCartQuantity,
            decreaseCartQuantity,
            removeFromCart,
            cartItems,
            cartQuantity,
            listShoppingCart,
            openCart,
            closeCart,
            listCart
        }}>
            {children}
            <ShoppingCart isOpen={isOpen} />
        </shoppingCartContext.Provider>
    )
}

ShoppingCartProvider.propTypes = {
    children: PropTypes.node.isRequired,
}