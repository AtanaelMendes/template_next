import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import Loading from "../Layouts/Loading";
import Checkbox from "../inputs/Checkbox";
import axiosInstance from "@/plugins/axios";

const TesteLearningStyles = ({
    active,
    cdPessoaCandidato,
    handleSave,
    handleSaveFn,
    afterSaveCallback,
}) => {
    const [respostasPerguntas, setRespostasPerguntas] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const [dadosTesteLS, setDadosTesteLS] = useState([]);
    const { toast } = useAppContext();

    const atualizaRespostasSelecionadas = (idPergunta, checked) => {
        setRespostasPerguntas((prevState) => {
            const newState = { ...prevState };
            newState[idPergunta] = checked ? "V" : "F";
            return newState;
        });
    };

    useEffect(() => {
        if (active) {
            setShowLoading(true);
            getDadosTesteLS();
        }
    }, [active]);

    const getDadosTesteLS = () => {
        axiosInstance
            .get(`teste/dados-teste-ls`)
            .then(function (response) {
                setDadosTesteLS(response.data.dados || []);
                setRespostasPerguntas(response.data.respostas || []);
                setShowLoading(false);
            })
            .catch(function (error) {
                setShowLoading(false);
                toast.error("Não foi possível carregar os dados do teste LS.");
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
            .post("teste/salvar-teste-ls", data)
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
                toast.error("Erro ao salvar teste learning styles.");
                console.error(error);
            });
    };

    const renderTesteLS = () => {
        if (!dadosTesteLS) {
            return "Dados não recebidos";
        }

        let objTeste = [];
        Object.keys(dadosTesteLS).forEach((idPergunta, index) => {
            const qtdPerguntas = Object.keys(dadosTesteLS).length - 1;
            objTeste.push(
                <div
                    className={`border-r border-l ${index == 0 ? "border-t rounded-t-md" : ""} ${
                        qtdPerguntas == index ? "border-b rounded-b-md" : ""
                    } odd:bg-white even:bg-gray-100 divide-y divide-gray-200`}
                >
                    <div className={`flex px-1 divide-x divide-gray-300`}>
                        <div className={`pl-2 py-1 flex items-center`}>
                            <Checkbox
                                id={dadosTesteLS[idPergunta].ID}
                                label={`${index < 9 ? `0${index + 1}` : index + 1}. ${
                                    dadosTesteLS[idPergunta].DS_PERGUNTA
                                }`}
                                onChange={(id, checked) =>
                                    atualizaRespostasSelecionadas(id, checked)
                                }
                            />
                        </div>
                    </div>
                </div>
            );
        });

        return objTeste;
    };

    return (
        <div className={`col-span-12 h-[680px] relative ${!active ? "hidden" : ""}`}>
            <Loading active={showLoading} className={"sticky"} />
            <div className="my-4">{renderTesteLS()}</div>
        </div>
    );
};

export default TesteLearningStyles;
