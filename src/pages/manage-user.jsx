"use client"
import { RouteGuard } from "@/components/RouteGuard"
import notyf from "@/utils/notificacion";
import { useState, useEffect } from "react"
import { Pencil, Trash2, X } from 'lucide-react';
import ModalEdit from "@/components/Modal/EditModalUser";
import { useSession } from "next-auth/react";

export default function PageManageUser() {
    const [rol, setRol] = useState("user");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userEdit, setUserEdit] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false)
    const {data:session}=useSession()
    const roles = [{ role: 'user' }, { role: 'admin' }];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const userLocalStor = sessionStorage.getItem("users")
        if (userLocalStor) {
            setUsers(JSON.parse(userLocalStor));
            setIsLoading(false)
        } else {
            try {
                const response = await fetch('/api/manage-users');
                const data = await response.json();
                setUsers(data.users);
                sessionStorage.setItem("users", JSON.stringify(data.users))
                setIsLoading(false);
            } catch (error) {
                notyf.error("Error al cargar usuarios");
                setIsLoading(false);
            }
        }
    };

    const openModal = (u) => {
        setUserEdit(u)
        setIsOpenModal(true)
    }

    const notif=(tipeNotif)=>{
        if(tipeNotif==200){
            sessionStorage.removeItem("users")
            fetchUsers();
            return notyf.success("Usuario Editado");
        }else if(tipeNotif==400){
            return notyf.error("Error al editar usuario");
        }
        else{
            return notyf.error("Error en el servidor");
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rol || !email) return notyf.error("Complete los campos");
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/manage-users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, role: rol }),
            });

            if (response.ok) {
                notyf.success("Usuario agregado exitosamente");
                setEmail("");
                setRol("user");
                sessionStorage.removeItem("users")
                fetchUsers();
            } else if (response.status == 402) {
                notyf.error("El usuario ya esta agregado");
            }
            else {
                notyf.error("rellene todos los campos")
            }
        } catch (error) {
            notyf.error("Error al guardar usuario");
        } finally {
            setIsSubmitting(false);
        }
    };

    

    const handleDelete = async (email) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                const response = await fetch(`/api/manage-users?email=${email}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    notyf.success("Usuario eliminado exitosamente");
                    sessionStorage.removeItem("users")
                    fetchUsers();
                } else {
                    notyf.error("Error al eliminar usuario");
                }
            } catch (error) {
                notyf.error("Error al eliminar usuario");
            }
        }
    };

    return (
        <RouteGuard permission="manage-users">
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-8">
              
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">Gestión de usuarios</h1>
                            <p className="mt-2 text-gray-600">Concede permisos o cambia roles a tus usuarios</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                                        Correo*
                                    </label>
                                    <input
                                        id="text"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                        placeholder="ejemplo@gmail.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="voice" className="block text-sm font-medium text-gray-700 mb-1">
                                        Selección de Rol*
                                    </label>
                                    <select
                                        id="rol"
                                        required
                                        value={rol}
                                        onChange={(e) => setRol(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                    >
                                        {roles.map((v, index) => (
                                            <option key={index} value={v.role}>{v.role}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium 
                                ${isSubmitting ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} 
                                transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                            >
                                {isSubmitting ? 'Guardando...' : 'Guardar usuario'}
                            </button>
                        </form>


                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rol
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-4 text-center">
                                                    Cargando usuarios...
                                                </td>
                                            </tr>
                                        ) : users.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-4 text-center">
                                                    No hay usuarios registrados
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user) => (
                                                <tr key={user.email}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{user.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{user.role}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                             onClick={() => openModal(user)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                        >
                                                            <Pencil className="h-5 w-5"/>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.email)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <ModalEdit isOpen={isOpenModal} closeModal={() => { setIsOpenModal(false); setUserEdit(null) }} title="Editar Rol" user={userEdit} notif={notif}/>

            </div>
        </RouteGuard >
    )
}