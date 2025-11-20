import { Caption, Label } from "@/components/Layouts/Typography";
import { useEffect, useState } from "react";
import InputTextArea from "../../inputs/InputTextArea";
import Select2 from "@/components/inputs/Select2";
import Button from "@/components/buttons/Button";
import axiosInstance from "@/plugins/axios";

const AddGrupoCandidato = (props) => {
    const [opcoesGrupos, setOpcoesGrupos] = useState([]);
    const [description, setDescription] = useState("");
    const [grupo, setGrupo] = useState("");

    useEffect(() => {
        setGrupo("");

        if (props.showDialog) {
            getListaGrupos();
        }
    }, [props?.showDialog]);

    const getListaGrupos = () => {
        axiosInstance
            .get("grupo/grupos-list")
            .then(function (response) {
                const gruposArray = response.data.map((item, index) => {
                    return {
                        value: item.CD_TIPO_GRUPO_CANDIDATO,
                        label: item.NM_TIPO_GRUPO_CANDIDATO,
                    };
                });

                setOpcoesGrupos(gruposArray || []);
            })
            .catch(function (error) {
                toast.error("Erro ao buscar grupos de candidato");
                console.error(error);
            });
    };

    const closeDialog = () => {
        setGrupo("");

        if (typeof props.closeDialogCallback == "function") {
            props.closeDialogCallback();
        }

        setOpcoesGrupos([]);
        props.setDialogControl(false);
    };

    const acceptDialog = () => {
        if (typeof props.confirmActionCallback == "function") {
            props.confirmActionCallback(grupo, description);
        }
        setOpcoesGrupos([]);
        props.setDialogControl(false);
    };

    //Limpa o conteudo do textarea ao esconder a tela
    useEffect(() => {
        setDescription("");
    }, [props?.showDialog]);

    return (
        <div
            className={`z-50 left-0 top-0 w-full h-screen bg-black bg-opacity-40 items-center fixed ${
                props?.showDialog ? "flex" : "hidden"
            }`}
        >
            <div
                className={`h-[550px] w-full md:w-1/2 lg:w-2/5 bg-white m-auto relative rounded-lg`}
            >
                {/* {TITLE} */}
                <div
                    className={`z-50 w-full px-4 p-2 font-semibold border-b border-slate-300 text-white bg-blue-700 rounded-t-lg`}
                >
                    Incluir candidato a grupo
                </div>

                {/* CONTEUDO */}
                <div className={`z-50 px-4 pt-1 w-full`}>
                    {props?.nmPessoa && (
                        <div>
                            <Caption>Candidato:&nbsp;</Caption>
                            <Label>{`${props.cdPessoaCandidato} - ${props.nmPessoa}`}</Label>
                        </div>
                    )}
                    <div>
                        <Select2
                            value={grupo}
                            id={"cd_grupo"}
                            options={opcoesGrupos}
                            clearSelectdValue={props?.showDialog}
                            label={"Grupo de candidato"}
                            onChange={(id, value) => setGrupo(value)}
                        />
                    </div>
                    <div>
                        <InputTextArea
                            rows="5"
                            maxLength={200}
                            value={description}
                            label={"Observação"}
                            onChange={(id, value) => setDescription(value)}
                        />
                    </div>
                </div>

                {/* {BUTTONS} */}
                <div
                    className={`bottom-0 z-50 absolute w-full p-2 h-[46px] rounded-b-lg border-t bg-white border-slate-300 text-right`}
                >
                    <Button
                        buttonType="danger"
                        outline
                        size="small"
                        className={"mr-4"}
                        onClick={closeDialog}
                    >
                        {"CANCELAR"}
                    </Button>
                    <Button
                        buttonType="primary"
                        outline
                        bordered
                        size="small"
                        onClick={acceptDialog}
                    >
                        {"CRIAR"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddGrupoCandidato;
