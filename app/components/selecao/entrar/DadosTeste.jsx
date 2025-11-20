import { useCallback, useEffect, useState } from "react";
import { FieldLabel } from "@/components/Layouts/Typography";
import SelectTestes from "@/components/inputs/SelectTestes";
import InputNumber from "@/components/inputs/InputNumber";
import { empty, validateForm } from "@/assets/utils.js";
import InputDate from "@/components/inputs/InputDate";
import Checkbox from "@/components/inputs/Checkbox";
import Select from "@/components/inputs/Select";
import { useAppContext } from "@/context/AppContext";
import axiosInstance from "@/plugins/axios";

const DadosTeste = ({
    active,
    cdPessoaCandidato,
    isEdit,
    idTeste,
    triggerClearFields,
    setShowLoading,
    handleSave,
    handleSaveFn,
    afterSaveCallback,
}) => {
    const [isEnabledCdGrauTeste, setEnabledCdGrauTeste] = useState(true);
    const [showCdGrauTeste, setShowCdGrauTeste] = useState(true);
    const [isEnabledNrNota, setEnabledNrNota] = useState(true);
    const [limparTestes, setLimpartestes] = useState(false);
    const [showNrNota, setShowNrNota] = useState(false);
    const { toast } = useAppContext();
    const dtToday = moment().format("YYYY-MM-DD");
    const defaultFields = {
        dt_teste: dtToday,
        id_tipo_teste: "",
        cd_grau_teste: "",
        id_gera_laudo: "",
        cd_teste: "",
        id_teste: "",
        nr_nota: "",
    };
    const [dadosTeste, setDadosTeste] = useState(defaultFields);
    const [formValidate, setformValidate] = useState({
        dt_teste: {
            error: false,
            errorMsg: "Necessário informar a data do teste!",
        },
        cd_teste: {
            error: false,
            errorMsg: "Necessário selecionar um teste!",
        },
    });
    const [validaNrNota, setValidaNrNota] = useState({
        nr_nota: {
            error: false,
            errorMsg: "Necessário informar o grau do teste!",
        },
    });
    const [validaCdGrauTeste, setValidaCdGrauTeste] = useState({
        cd_grau_teste: {
            error: false,
            errorMsg: "Necessário selecionar o grau do teste!",
        },
    });

    const handleSaveButton = () => {
        //Valida data e teste
        if (validateForm(formValidate, setformValidate, dadosTeste, toast)) {
            return;
        }

        //Valida o select 'Grau teste' se o mesmo estiver habilitado
        if (showCdGrauTeste && isEnabledCdGrauTeste && dadosTeste.cd_grau_teste === "") {
            validateForm(validaCdGrauTeste, setValidaCdGrauTeste, dadosTeste, toast);
            return;
        }

        //Valida o 'Grau teste' numerico se o mesmo estiver habilitado
        if (showNrNota && isEnabledNrNota && dadosTeste.nr_nota === "") {
            validateForm(validaNrNota, setValidaNrNota, dadosTeste, toast);
            return;
        }

        setShowLoading(true);

        if (isEdit) {
            return atualizarDados();
        }

        salvarDados();
    };

    useEffect(() => {
        clearErrors();
    }, [active]);

    //Limpa o estado dos erros após salvar/editar
    const clearErrors = () => {
        let fields = Object.keys(formValidate);
        let fieldsNota = Object.keys(validaNrNota);
        let fieldsGrau = Object.keys(validaCdGrauTeste);

        for (const field of fields) {
            setformValidate((prev) => ({ ...prev, [field]: { ...prev[field], error: false } }));
        }

        for (const fieldNota of fieldsNota) {
            setValidaNrNota((prev) => ({
                ...prev,
                [fieldNota]: { ...prev[fieldNota], error: false },
            }));
        }

        for (const fieldGrau of fieldsGrau) {
            setValidaCdGrauTeste((prev) => ({
                ...prev,
                [fieldGrau]: { ...prev[fieldGrau], error: false },
            }));
        }
    };

    useEffect(() => {
        if (handleSave) {
            handleSaveButton();
            //Volta o estado do botão Salvar
            handleSaveFn(false);
        }
    }, [handleSave]);

    const salvarDados = () => {
        try {
            axiosInstance
                .post("teste/inserir-teste", {
                    ...dadosTeste,
                    cd_pessoa_candidato: cdPessoaCandidato,
                })
                .then(function (response) {
                    if (response.status === 200) {
                        if (response.data == 1) {
                            setShowLoading(false);
                            afterSaveCallback();
                            return toast.success("Teste inserido com sucesso!");
                        }
                        setShowLoading(false);
                        return toast.error("Erro ao inserir teste.");
                    }
                    setShowLoading(false);
                })
                .catch(function (error) {
                    setShowLoading(false);
                    toast.error("Não foi possível salvar o teste.");
                    console.error(error);
                });
        } catch (error) {
            setShowLoading(false);
            console.error("Erro ao enviar dados:", error);
        }
    };

    const atualizarDados = () => {
        try {
            axiosInstance
                .post("teste/atualizar-teste", {
                    ...dadosTeste,
                    cd_pessoa_candidato: cdPessoaCandidato,
                })
                .then(function (response) {
                    if (response.status === 200) {
                        if (response.data == 1) {
                            setShowLoading(false);
                            afterSaveCallback();
                            return toast.success("Teste atualizado com sucesso!");
                        }
                        setShowLoading(false);
                        return toast.error("Erro ao atualizar teste.");
                    }
                    setShowLoading(false);
                })
                .catch(function (error) {
                    setShowLoading(false);
                    toast.error("Não foi possível atualizar o teste.");
                    console.error(error);
                });
        } catch (error) {
            setShowLoading(false);
            console.error("Erro ao enviar dados:", error);
        }
    };

    const setFormDataTeste = useCallback((id, value) => {
        setDadosTeste((prevState) => ({ ...prevState, [id]: value }));
    });

    const handleChangeSelectTeste = useCallback((id, value, type) => {
        setDadosTeste((prevState) => ({ ...prevState, [id]: value }));
        setShowNrNota(type == "N" || type == "E");
        setEnabledNrNota(type == "N" || type == "E");
        setShowCdGrauTeste(type == "C" || type == "E");
        setEnabledCdGrauTeste(type == "C" || type == "E");
    });

    const handleChangeSelectGrauTeste = useCallback((id, value) => {
        setDadosTeste((prevState) => ({ ...prevState, [id]: value }));
        setFormDataTeste("nr_nota", "");
        //Caso o select e o inputNumber estejam sendo exibidos, habilita o campo de grau numerico se o valor do select de grau for vazio (senão deixa habilitado)
        setEnabledNrNota(showCdGrauTeste && showNrNota ? value == "" : true);
    });

    const handleChangeNumericGrauTeste = useCallback((id, value) => {
        //Limpa o campo ao chagar a zero
        value = parseInt(value) == 0 ? "" : value;
        //Seta o valor no state
        setDadosTeste((prevState) => ({ ...prevState, [id]: value }));
        setFormDataTeste("cd_grau_teste", "");
        //Caso o select e o inputNumber estejam sendo exibidos, habilita o select de grau se o valor do campo de grau numerico for vazio (senão deixa habilitado)
        setEnabledCdGrauTeste(showCdGrauTeste && showNrNota ? value == "" : true);
    });

    const getDadosTeste = useCallback(() => {
        axiosInstance
            .get(`teste/dados-teste/${idTeste}`)
            .then(function (response) {
                setDadosTeste({
                    cd_grau_teste: response.data.CD_GRAU_TESTE || "",
                    id_gera_laudo: response.data.ID_GERA_LAUDO == "S",
                    id_tipo_teste: response.data.ID_TIPO_TESTE || "",
                    dt_teste: response.data.DT_TESTE || "",
                    cd_teste: response.data.CD_TESTE || "",
                    nr_nota: response.data.NR_NOTA || "",
                    id_teste: idTeste,
                });

                const showNrNota =
                    response.data.ID_TIPO_TESTE == "N" || response.data.ID_TIPO_TESTE == "E";
                const showCdGrau =
                    response.data.ID_TIPO_TESTE == "C" || response.data.ID_TIPO_TESTE == "E";
                setShowNrNota(showNrNota);
                setShowCdGrauTeste(showCdGrau);
                setEnabledNrNota(showCdGrau && showNrNota ? !empty(response.data.NR_NOTA) : true);
                setEnabledCdGrauTeste(
                    showCdGrau && showNrNota ? !empty(response.data.CD_GRAU_TESTE) : true
                );

                setShowLoading(false);
            })
            .catch(function (error) {
                setShowLoading(false);
                toast.error("Não foi possível carregar os dados do teste.");
                console.error(error);
            });
    });

    useEffect(() => {
        clearFields();

        if (isEdit) {
            getDadosTeste();
        }
    }, [isEdit]);

    //Limpa as variaveis
    const clearFields = () => {
        setDadosTeste(defaultFields);
        setLimpartestes(true);
        setShowNrNota(false);
        setEnabledNrNota(true);
        setShowCdGrauTeste(true);
        setEnabledCdGrauTeste(true);
    };

    useEffect(() => {
        if (triggerClearFields) {
            clearFields();
        }
    }, [triggerClearFields]);

    return (
        <div className={`col-span-12 ${active ? "block" : "hidden"} mx-2`}>
            <div className={`w-full min-h-[600px]`}>
                <div className="pt-2 px-1">
                    <InputDate
                        id="dt_teste"
                        label="Data"
                        required={formValidate}
                        value={dadosTeste.dt_teste}
                        onChange={(id, value) => setFormDataTeste(id, value)}
                    />
                </div>
                <div className="pt-2 px-1">
                    <SelectTestes
                        id="cd_teste"
                        label="Teste"
                        active={active}
                        required={formValidate}
                        value={dadosTeste.cd_teste}
                        limparOpcoes={limparTestes}
                        setLimparOpcoes={setLimpartestes}
                        cdTeste={dadosTeste.cd_teste || 0}
                        cdPessoaCandidato={cdPessoaCandidato}
                        onChange={(id, value, type) => handleChangeSelectTeste(id, value, type)}
                    />
                </div>
                <div className={`pt-2 px-1`}>
                    <FieldLabel required={true}>Grau teste</FieldLabel>
                    <div className={"flex"}>
                        <div className={`pr-1 w-1/2 ${showCdGrauTeste ? "" : "hidden"}`}>
                            <Select
                                options={[
                                    { label: "Superior", value: "S" },
                                    { label: "Médio Superior", value: "MS" },
                                    { label: "Médio", value: "M" },
                                    { label: "Médio Inferior", value: "MI" },
                                    { label: "Inferior", value: "I" },
                                ]}
                                hideClearButton
                                id={"cd_grau_teste"}
                                placeholder={"Selecione"}
                                required={validaCdGrauTeste}
                                value={dadosTeste.cd_grau_teste}
                                disabled={!isEnabledCdGrauTeste}
                                onChange={(id, value) => handleChangeSelectGrauTeste(id, value)}
                            />
                        </div>
                        <div className={`pl-1 w-1/2 ${showNrNota ? "" : "hidden"}`}>
                            <InputNumber
                                min={0}
                                max={10}
                                id="nr_nota"
                                required={validaNrNota}
                                value={dadosTeste.nr_nota}
                                disabled={!isEnabledNrNota}
                                onChange={(id, value) => handleChangeNumericGrauTeste(id, value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="pt-4 px-1">
                    <Checkbox
                        id="id_gera_laudo"
                        label="Gera laudo"
                        checked={dadosTeste.id_gera_laudo}
                        onChange={(id, value) => setFormDataTeste(id, value)}
                    />
                </div>
            </div>
        </div>
    );
};
export default DadosTeste;
