import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import Loading from "../Layouts/Loading";
import Checkbox from "../inputs/Checkbox";
import axiosInstance from "@/plugins/axios";

const TesteLearningMeans = ({
    active,
    cdPessoaCandidato,
    handleSave,
    handleSaveFn,
    afterSaveCallback,
}) => {
    const [respostasPerguntas, setRespostasPerguntas] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const [dadosTesteLM, setDadosTesteLM] = useState([]);
    const { toast } = useAppContext();

    const atualizaRespostasSelecionadas = (idResposta) => {
        setRespostasPerguntas((prevSelected) => {
            // Verifica se o ID da pergunta já está no array
            const isSelected = prevSelected.includes(idResposta);

            // Se já estiver selecionado, remove; caso contrário, adiciona
            if (isSelected) {
                return prevSelected.filter((id) => id !== idResposta);
            } else {
                return [...prevSelected, idResposta];
            }
        });
    };

    useEffect(() => {
        if (active) {
            setShowLoading(true);
            getDadosTesteLM();
        }
    }, [active]);

    const getDadosTesteLM = () => {
        axiosInstance
            .get(`teste/dados-teste-lm`)
            .then(function (response) {
                setDadosTesteLM(response.data || []);
                setShowLoading(false);
            })
            .catch(function (error) {
                setShowLoading(false);
                toast.error("Não foi possível carregar os dados do teste LM.");
                console.error(error);
            });
    };

    useEffect(() => {
        if (handleSave) {
            handleSaveButton();
            //Volta o estado do botão Salvar
            handleSaveFn(false);
        }
    }, [handleSave]);

    const handleSaveButton = () => {
        setShowLoading(true);

        let data = new FormData();
        data.append("cd_pessoa_candidato", cdPessoaCandidato);
        data.append("respostas", JSON.stringify(respostasPerguntas));

        axiosInstance
            .post("teste/salvar-teste-lm", data)
            .then(function (response) {
                if (response.status === 200) {
                    //Se foi salvo sem erros
                    if (response.data.status == 1) {
                        setShowLoading(false);
                        afterSaveCallback();
                        return toast.success(response.data.message);
                    }

                    //Se houve algum erro ao salvar
                    setShowLoading(false);
                    return toast.error(response.data.message);
                }
                setShowLoading(false);
            })
            .catch(function (error) {
                setShowLoading(false);
                toast.error("Erro ao salvar teste learning means.");
                console.error(error);
            });
    };

    const renderTesteLM = () => {
        if (!dadosTesteLM) {
            return "Dados não recebidos";
        }

        let respostas = "";
        let objTeste = [];
        const listItems = {
            0: "a",
            1: "b",
            2: "c",
            3: "d",
        };

        Object.keys(dadosTesteLM).forEach((idPergunta, index) => {
            const qtdPerguntas = Object.keys(dadosTesteLM[idPergunta]).length - 1;
            respostas = dadosTesteLM[idPergunta].map((resposta, index) => (
                <div
                    className={`border-r border-l ${
                        qtdPerguntas == index ? "border-b rounded-b-md" : ""
                    } odd:bg-white even:bg-gray-100 divide-y divide-gray-200`}
                >
                    <div className={`flex px-1 divide-x divide-gray-300`}>
                        <div className={`pl-2 py-1 flex items-center`}>
                            <Checkbox
                                id={resposta.ID_RESPOSTA}
                                label={`${listItems[index]}. ${resposta.DS_RESPOSTA}`}
                                onChange={(id, value) =>
                                    atualizaRespostasSelecionadas(resposta.ID_RESPOSTA)
                                }
                            />
                        </div>
                    </div>
                </div>
            ));

            objTeste.push(
                <div key={index} className={`m-4 shadow-lg`}>
                    <div
                        className={`px-2 rounded-t-md bg-primary text-white w-full text-sm font-semibold flex items-center`}
                    >
                        <div className={`pl-2 py-1`}>
                            {`${index + 1}. ${dadosTesteLM[idPergunta][0]["DS_PERGUNTA"]}`}
                        </div>
                    </div>
                    {respostas}
                </div>
            );
        });

        return objTeste;
    };

    return (
        <div className={`col-span-12 h-[680px] relative ${!active ? "hidden" : ""}`}>
            <Loading active={showLoading} className={"sticky"} />
            {renderTesteLM()}
        </div>
    );
};

export default TesteLearningMeans;
