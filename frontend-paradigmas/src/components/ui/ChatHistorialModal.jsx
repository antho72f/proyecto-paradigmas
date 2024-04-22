import { useState, useEffect } from 'react';
import { useAuth } from "../../context/authContext";
import { getHistoryByUserIdRequest, deleteHistoryRequest } from '../../api/historial';
import { RiEyeLine, RiDeleteBinLine } from 'react-icons/ri';

export const ChatHistorialModal = ({ visible, onClose, onViewMessage }) => {
    const { user } = useAuth();
    const [historial, setHistorial] = useState([]);

    useEffect(() => {
        if (visible && user) {
            getHistoryByUserIdRequest(user.ID)
                .then(response => {
                    setHistorial(response.data);
                })
                .catch(error => {
                    //console.error('Error al obtener el historial del usuario:', error);
                });
        }
    }, [visible, user]);

    const handleDelete = async (mensaje) => {
        try {
            await deleteHistoryRequest(mensaje.ID); 
            setHistorial(prevHistorial => prevHistorial.filter(item => item.ID !== mensaje.ID));
        } catch (error) {
            //console.error('Error al eliminar el mensaje:', error);
        }
    };

    const handleView = (mensaje) => {
        onViewMessage(mensaje.ID);
    };

    const handleOnClose = (e) => {
        if (e.target.id === "container") onClose();
    };

    if (!visible) return null;

    return (
        <div
            id="container"
            onClick={handleOnClose}
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
        >
            <div className="bg-white p-4 rounded w-96">
                <h1 className="font-semibold text-center text-xl text-gray-700">
                    Historial
                </h1>
                <div className="h-64 overflow-y-auto">
                    {historial.length === 0 ? (
                        <p className="text-gray-500 text-center">No hay mensajes en el historial.</p>
                    ) : (
                        historial.map((mensaje, index) => (
                            <div key={index} className="mb-2 flex justify-between items-center">
                                <div className="flex items-center">
                                    <RiEyeLine className="mr-2 text-gray-500 cursor-pointer" onClick={() => handleView(mensaje)} />
                                    <span style={{ color: 'black' }}>{mensaje.Nombre.length > 40 ? `${mensaje.Nombre.substring(0, 10)}...` : mensaje.Nombre}</span>
                                </div>
                                <RiDeleteBinLine className="text-red-500 cursor-pointer" onClick={() => handleDelete(mensaje)} />
                            </div>
                        ))
                    )}
                </div>
                <div className="text-center mt-4">
                    <button onClick={onClose} className="px-5 py-2 bg-gray-700 text-white rounded">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
