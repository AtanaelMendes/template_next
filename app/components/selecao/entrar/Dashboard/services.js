import axiosInstance from "@/plugins/axios";

/**
 * Função genérica que pega dados
 */
export async function getData(setData, setReady, url, toast, params, errorMessage) {
    setReady(false);
    axiosInstance.get(url, { params })
        .then((response) => {
            setData(response?.data);
            setReady(true);
        }).catch(function (error) {
            toast.error(errorMessage);
            setReady(false);
            console.error(error);
        });
}