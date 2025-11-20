import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useState } from "react";
import InputTextArea from "../inputs/InputTextArea";
import Button from "@/components/buttons/Button";
import InputFile from "../inputs/InputFile";
import InputText from "../inputs/InputText";
import { empty } from "@/assets/utils";
import Select from "../inputs/Select";
import DatePicker from "../inputs/DatePicker";
import { parse } from "date-fns";

const CardAddPCD = ({ id, onChange, deleteCardFunction }) => {
    const [dadosNewPCD, setDadosNewPCD] = useState({
        cd_tipo_deficiencia: "",
        ds_observacao: "",
        arquivo_laudo: {},
        dt_validade: "",
        cd_cid: "",
    });

    const setdadosNewPCDCallback = useCallback((id, value) => {
        setDadosNewPCD((prevState) => ({ ...prevState, [id]: value }));
    });

    useEffect(() => {
        if (typeof onChange === "function") {
            onChange(dadosNewPCD);
        }
    }, [dadosNewPCD]);

    return (
        <div className="mb-3">
            <div className={`bg-blue-600 text-white font-semibold rounded-t-lg px-4 text-sm py-1`}>
                Adicionar deficiência
            </div>
            <div className={"p-2 border rounded-b-lg"}>
                <div className="grid grid-cols-12 w-full gap-2">
                    <div className={"justify-between col-span-4"}>
                        <Select
                            options={[
                                { value: "1", label: "Física" },
                                { value: "2", label: "Auditiva" },
                                { value: "3", label: "Visual" },
                                { value: "4", label: "Mental" },
                                { value: "6", label: "Intelectual" },
                                { value: "7", label: "Reabilitado" },
                            ]}
                            hideClearButton
                            placeholder={"Selecione"}
                            label={"Tipo de deficiência:"}
                            id={`${id}_cd_tipo_deficiencia`}
                            onChange={(id, value) =>
                                setdadosNewPCDCallback("cd_tipo_deficiencia", value)
                            }
                        />
                        <div className={"mt-2"}>
                            <InputFile
                                subLabel="(Máx.5MB)"
                                label="Arquivo de laudo"
                                id={`${id}_arquivo_laudo`}
                                onChange={(id, value) =>
                                    setdadosNewPCDCallback("arquivo_laudo", value)
                                }
                            />
                        </div>
                    </div>
                    <div className={"justify-between flex col-span-2"}>
                        <div className="w-full">
                            <InputText
                                label={"CID:"}
                                id={`${id}_cd_cid`}
                                value={dadosNewPCD.cd_cid}
                                onChange={(id, value) => setdadosNewPCDCallback("cd_cid", value)}
                            />
                            <div className={"mt-2 relative"}>
                                <DatePicker
                                    label={"Data do laudo:"}
                                    onChange={(id, value) =>
                                        setdadosNewPCDCallback("dt_validade", value)
                                    }
                                    maxDate={new Date()}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={"col-span-5"}>
                        <InputTextArea
                            rows="5"
                            maxLength={150}
                            id={`${id}_ds_observacao`}
                            value={dadosNewPCD.ds_observacao}
                            label={"Descreva sua deficiência:"}
                            onChange={(id, checked) =>
                                setdadosNewPCDCallback("ds_observacao", checked)
                            }
                        />
                    </div>
                    <div className={"flex col-span-1 justify-center"}>
                        <Button
                            buttonType="danger"
                            outline
                            bordered
                            size="small"
                            className={"h-8 self-center mr-1 px-1 py-1"}
                            onClick={() => {
                                deleteCardFunction();
                            }}
                        >
                            Remover
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CardEditPCD = ({
    id,
    dados,
    onChange,
    deleteCardFunction,
    disableCardFunction,
    enableCardFunction,
}) => {
    const [possuiArquivoLaudo, setPossuiArquivoLaudo] = useState(false);
    const [laudoInativo, setLaudoInativo] = useState(false);
    const [skipEffect, setSkipEffect] = useState(true);
    const [dadosPCD, setDadosPCD] = useState({
        cd_tipo_deficiencia: "",
        ds_caminho_laudo: "",
        ds_observacao: "",
        arquivo_laudo: {},
        criado_em: "",
        nm_status: "",
        dt_validade: "",
        id_status: "",
        cd_cid: "",
    });

    const setdadosPCDCallback = useCallback((id, value) => {
        setSkipEffect(false);
        setDadosPCD((prevState) => ({ ...prevState, [id]: value }));
    });

    useEffect(() => {
        //Ao carregar os valores do card salvo, não disparar a atualização do objeto do componente pai
        setSkipEffect(true);

        if (!empty(dados)) {
            setDadosPCD(dados);
            setLaudoInativo(dados?.id_status === "I");
            setPossuiArquivoLaudo(!empty(dados?.ds_caminho_laudo));
        }
    }, [dados]);

    useEffect(() => {
        if (skipEffect) {
            setSkipEffect(true);
            return;
        }

        if (typeof onChange === "function") {
            onChange(dadosPCD);
        }
    }, [dadosPCD]);

    return (
        <div className="mb-3">
            <div className={`bg-blue-600 text-white font-semibold rounded-t-lg px-4 text-sm py-1`}>
                Editar deficiência
            </div>
            <div className={"p-2 border-l border-r"}>
                <div className="grid grid-cols-12 w-full gap-2">
                    <div className={"justify-between col-span-4"}>
                        <Select
                            options={[
                                { value: "1", label: "Física" },
                                { value: "2", label: "Auditiva" },
                                { value: "3", label: "Visual" },
                                { value: "4", label: "Mental" },
                                { value: "6", label: "Intelectual" },
                                { value: "7", label: "Reabilitado" },
                            ]}
                            hideClearButton
                            disabled={laudoInativo}
                            placeholder={"Selecione"}
                            label={"Tipo de deficiência:"}
                            id={`${id}_cd_tipo_deficiencia`}
                            value={dadosPCD.cd_tipo_deficiencia}
                            onChange={(id, value) => setdadosPCDCallback(id, value)}
                        />
                        <div className={"mt-2"}>
                            {/* Caso o arquivo não tenha sido selecionado */}
                            {!possuiArquivoLaudo && (
                                <InputFile
                                    subLabel="(Máx.5MB)"
                                    disabled={laudoInativo}
                                    label="Arquivo de laudo"
                                    id={`${id}_arquivo_laudo`}
                                    onChange={(id, value) =>
                                        setdadosPCDCallback("arquivo_laudo", value)
                                    }
                                />
                            )}
                            {/* Caso já possua arquivo selecionado */}
                            {possuiArquivoLaudo && (
                                <div className={"flex mt-7 justify-center"}>
                                    <span
                                        className={`flex text-md p-2 text-blue-700 hover:underline cursor-pointer font-semibold`}
                                    >
                                        <div className={"flex justify-center text-center w-full"}>
                                            <FontAwesomeIcon
                                                icon={faPaperclip}
                                                width="16"
                                                height="16"
                                            />
                                            <span
                                                className={"ml-2"}
                                                onClick={() => {
                                                    window.open(
                                                        `${process.env.NEXT_PUBLIC_BASE_URL}/${dados.ds_caminho_laudo}`,
                                                        "_blank"
                                                    );
                                                }}
                                            >
                                                Arquivo de laudo
                                            </span>
                                        </div>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={"justify-between flex col-span-2"}>
                        <div className="w-full">
                            <InputText
                                label={"CID:"}
                                maxLength={50}
                                id={`${id}_cd_cid`}
                                value={dadosPCD.cd_cid}
                                disabled={laudoInativo}
                                onChange={(id, value) => setdadosPCDCallback("cd_cid", value)}
                            />
                            <div className={"mt-2 relative"}>
                                <DatePicker
                                    label={"Data do laudo:"}
                                    onChange={(id, value) =>
                                        setdadosPCDCallback("dt_validade", value)
                                    }
                                    maxDate={new Date()}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={"col-span-5"}>
                        <InputTextArea
                            rows="5"
                            maxLength={150}
                            disabled={laudoInativo}
                            id={`${id}_ds_observacao`}
                            value={dadosPCD.ds_observacao}
                            label={"Descreva sua deficiência:"}
                            onChange={(id, checked) =>
                                setdadosPCDCallback("ds_observacao", checked)
                            }
                        />
                    </div>
                    <div className={"col-span-1 content-center"}>
                        {!laudoInativo && (
                            <Button
                                buttonType="primary"
                                outline
                                bordered
                                size="small"
                                className={"h-8 self-center mr-1 px-1 py-1 w-full"}
                                onClick={() => {
                                    disableCardFunction();
                                }}
                            >
                                Inativar
                            </Button>
                        )}
                        {laudoInativo && (
                            <Button
                                buttonType="primary"
                                outline
                                bordered
                                size="small"
                                className={"h-8 self-center mr-1 px-1 py-1 w-full"}
                                onClick={() => {
                                    enableCardFunction();
                                }}
                            >
                                Reativar
                            </Button>
                        )}
                        <Button
                            buttonType="danger"
                            outline
                            bordered
                            size="small"
                            className={"h-8 self-center mr-1 px-1 py-1 w-full mt-4"}
                            onClick={() => {
                                deleteCardFunction();
                            }}
                        >
                            Excluir
                        </Button>
                    </div>
                </div>
            </div>
            <div className={`bg-gray-300 rounded-b-lg px-4 text-sm py-1`}>
                <div className="grid grid-cols-12 w-full">
                    <div className="col-span-6 text-center">
                        <span>Adicionado em: </span>
                        <span className="font-bold text-gray-600">{dadosPCD.criado_em || "-"}</span>
                    </div>
                    <div className="col-span-6 text-center">
                        <span>Situação: </span>
                        <span className="font-bold text-gray-600">
                            {dadosPCD.nm_status || "Indefinido"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { CardAddPCD, CardEditPCD };
