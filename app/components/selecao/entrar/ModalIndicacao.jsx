import React from "react";
import DatePicker from "@/components/inputs/DatePicker";
import Select from "@/components/inputs/Select";
import { DebouncedSearch } from "@/components/inputs/DebouncedSearch";
import InputTextArea from "@/components/inputs/InputTextArea";
import InputText from "@/components/inputs/InputText";
import axiosInstance from "@/plugins/axios";
import { useAppContext } from "@/context/AppContext";
import Checkbox from "@/components/inputs/Checkbox";
import { cn } from "@/assets/utils";
import Radio from "@/components/inputs/Radio";

export const ModalIndicacao = ({ indicacao, onChangeForm, editMode, onRequireTipoIndicacao }) => {
    const { user } = useAppContext();
    const [clienteMod, setClienteMod] = React.useState(null);
    const [indicacaoTipo, setIndicacaoTipo] = React.useState(null);
    const [telefoneIndicador, setTelefoneIndicador] = React.useState("");

    const handleChangeObservacoes = (id, value) => {
        onChangeForm(id, value);
    };

    const handleChangeIndicacaoTipo = (id, value) => {
        setIndicacaoTipo(value);
        onChangeForm("id_tipo_indicacao", value);
    };

    const handleChangeTelefoneIndicador = (id, value) => {
        setTelefoneIndicador(value);
        onChangeForm("nr_telefone_indicador", value);
    };

    const handleChangeEmpresa = async (value) => {
        onChangeForm("cd_pessoa_cliente", value);

        const empresaModInfo = await getEmpresaSelecionadaInfo(value);
        setClienteMod(empresaModInfo);

        if (empresaModInfo?.TIPOS_PROCESSOS?.length > 0) {
            onRequireTipoIndicacao?.(true);
        } else {
            onRequireTipoIndicacao?.(false);
        }
    };

    const getEmpresaSelecionadaInfo = async (empresa) => {
        if (empresa) {
            const response = await axiosInstance.get(`cliente/mod/${empresa}/${user.user_sip}`);
            return response.data;
        }
    };

    const getClienteMod = async (id_empresa) => {
        const empresaModInfo = await getEmpresaSelecionadaInfo(id_empresa);
        setClienteMod(empresaModInfo);
    };

    React.useEffect(() => {
        if (editMode) {
            getClienteMod(indicacao.cd_pessoa_cliente);
            handleChangeIndicacaoTipo("id_tipo_indicacao", indicacao.id_tipo_indicacao);
            handleChangeObservacoes("ds_observacao", indicacao.ds_observacao);
        }
    }, []);

    return (
        <div className="col-span-12 p-2">
            <div className="flex flex-col w-full gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-1">
                        {editMode ? (
                            <InputText
                                label={"Data da Indicação"}
                                id="dt_indicacao"
                                value={indicacao.dt_indicacao}
                                disabled
                            />
                        ) : (
                            <DatePicker
                                label={"Data Indicação"}
                                onChange={(date) => {
                                    onChangeForm("dt_indicacao", date);
                                }}
                                required
                            />
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        {editMode ? (
                            <InputText
                                label={"Cliente"}
                                id="nm_pessoa"
                                value={indicacao.nm_pessoa}
                                disabled
                            />
                        ) : (
                            <DebouncedSearch.Root>
                                <DebouncedSearch.Label label={"Cliente"} labelRequired />
                                <DebouncedSearch.Select
                                    delayed
                                    urlGet={`cliente/clientes`}
                                    optId="CD_PESSOA"
                                    optLabel="NM_PESSOA"
                                    onChange={(value) => {
                                        handleChangeEmpresa(value);
                                    }}
                                    otherParams={{
                                        maxChars: 0,
                                    }}
                                />
                            </DebouncedSearch.Root>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <DebouncedSearch.Root>
                            <DebouncedSearch.Label label={"Indicador"} labelRequired />
                            <DebouncedSearch.Select
                                delayed
                                urlGet={`candidato/candidatos`}
                                optId="CD_PESSOA"
                                optLabel="NM_PESSOA"
                                onChange={(value) => {
                                    onChangeForm("cd_pessoa_indica", value);
                                }}
                                value={indicacao.cd_pessoa_indica}
                            />
                        </DebouncedSearch.Root>
                    </div>
                </div>
                {clienteMod && (
                    <div className="flex flex-col gap-4">
                        <div className={cn("flex flex-wrap gap-2")}>
                            {clienteMod["TIPOS_PROCESSOS"] &&
                                clienteMod["TIPOS_PROCESSOS"].map((processo) => (
                                    <Radio
                                        id={processo.TIPO}
                                        key={processo.TIPO}
                                        label={processo.DS_TIPO_ABREVIADO}
                                        value={processo.TIPO}
                                        name="id_tipo_indicacao"
                                        checked={indicacaoTipo == processo.TIPO}
                                        onChange={(id, value, checked) => {
                                            if (!editMode && checked) {
                                                handleChangeIndicacaoTipo("id_tipo_indicacao", value);
                                            }
                                        }}
                                        disabled={editMode}
                                    />
                                ))}
                            {clienteMod?.["PROCESSO_PM"] && (
                                <Checkbox
                                    id={"id_processo_pm"}
                                    label={"Proj. Programa Mulher"}
                                    value={"S"}
                                    onChange={onChangeForm}
                                    checked={
                                        indicacao.id_processo_pm || indicacao.id_processo_pm == "S"
                                    }
                                />
                            )}
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-1">
                        <InputText
                            label={"Matrícula"}
                            id="ds_matricula_indicador"
                            onChange={onChangeForm}
                            value={indicacao.ds_matricula_indicador}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <InputText
                            label={"Área/Seção"}
                            id="ds_area_secao_indicador"
                            onChange={onChangeForm}
                            value={indicacao.ds_area_secao_indicador}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Select
                            label={"Turno"}
                            id="ds_turno_indicador"
                            onChange={onChangeForm}
                            placeholder={"Selecione um turno"}
                            options={[
                                { value: "MANHA", label: "Matutino" },
                                { value: "TARDE", label: "Vespertino" },
                                { value: "NOITE", label: "Noturno" },
                                { value: "COMERCIAL", label: "Comercial" },
                            ]}
                            value={indicacao.ds_turno_indicador ?? ""}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-1">
                        <InputText
                            label={"Cargo"}
                            id="ds_cargo_indicador"
                            onChange={onChangeForm}
                            value={indicacao.ds_cargo_indicador}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <InputText
                            label={"Nome do superior imediato"}
                            id="nm_superior_indicador"
                            onChange={onChangeForm}
                            value={indicacao.nm_superior_indicador}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Select
                            label={"Já trabalhou na empresa à qual está sendo indicado?"}
                            required
                            id="id_trabalhou_empresa_indicacao"
                            onChange={onChangeForm}
                            placeholder={"Selecione uma opção"}
                            options={[
                                { value: "S", label: "Sim" },
                                { value: "N", label: "Não" },
                            ]}
                            value={indicacao.id_trabalhou_empresa_indicacao ?? ""}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-1">
                        <InputTextArea
                            label={"Observações"}
                            id="ds_observacao"
                            onChange={handleChangeObservacoes}
                            value={indicacao.ds_observacao}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Select
                            label={"Grau de afinidade com o indicado"}
                            id="id_grau_afinidade_indicador"
                            onChange={onChangeForm}
                            placeholder={"Selecione um grau de afinidade"}
                            options={[
                                { value: "I", label: "Irmão" },
                                { value: "A", label: "Amigo" },
                                { value: "V", label: "Vizinho" },
                                { value: "P", label: "Parente" },
                                { value: "C", label: "Conhecido" },
                                { value: "O", label: "Outros" },
                            ]}
                            value={indicacao.id_grau_afinidade_indicador ?? ""}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <InputText
                            label={"Telefone do indicador"}
                            id="nr_telefone_indicador"
                            placeholder={"(00) 0000-0000"}
                            onChange={handleChangeTelefoneIndicador}
                            mask={"phone"}
                            value={telefoneIndicador}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
