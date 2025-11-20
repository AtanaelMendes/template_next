import React from "react";
import InputText from "@/components/inputs/InputText";
import SelectEstado from "@/components/inputs/SelectEstado";
import SelectCidade from "@/components/inputs/SelectCidade";
import Checkbox from "@/components/inputs/Checkbox";
import { empty, unmaskCpf } from "@/assets/utils";

const FiltroBuscaCandidatos = ({ filtrosPesquisa, setFiltrosPesquisa }) => {
    const handleChangeForm = React.useCallback(
        (id, value) => {
            setFiltrosPesquisa((prevState) => ({
                ...prevState, [id]: value,
            }));
        },
        [filtrosPesquisa, setFiltrosPesquisa]
    );
    
    const handleChangeEstado = React.useCallback((id, value) => {
            setFiltrosPesquisa((prevState) => ({
                ...prevState, [id]: value,
            }));
            
            //Se o estado for limpo, limpa a cidade também
            if (empty(value)) {
                setFiltrosPesquisa((prevState) => ({
                    ...prevState, ['cidade']: '',
                }));
            }
        },
        [filtrosPesquisa, setFiltrosPesquisa]
    );

    const handleChangeCpf = React.useCallback((id, value) => {
        handleChangeForm(id, unmaskCpf(value));
    }, []);

    const handleChangeBloqueado = React.useCallback((id, value) => {
        handleChangeForm(id, value ? "S" : "N");
    }, []);

    return (
        <div className="flex flex-col flex-wrap gap-y-4 w-full mt-2">
            <InputText
                label={"CPF"}
                value={filtrosPesquisa.cpf}
                id="cpf"
                onChange={handleChangeCpf}
                mask={"cpf"}
            />
            <InputText
                label={"Nome"}
                id="nome"
                onChange={handleChangeForm}
                value={filtrosPesquisa.nome}
            />
            <InputText
                label={"Código do candidato"}
                id="codigo"
                value={filtrosPesquisa.codigo}
                onChange={handleChangeForm}
                mask="numeric"
            />
            <Checkbox
                label={"Apenas bloqueados"}
                id="bloqueado"
                value={"S"}
                onChange={handleChangeBloqueado}
                checked={filtrosPesquisa.bloqueado === "S"}
            />
            <SelectEstado
                label="Estado"
                cdPais={1}
                id="estado"
                onChange={handleChangeEstado}
                init
                isClearable={true}
                value={filtrosPesquisa.estado}
            />
            <SelectCidade
                label="Cidade"
                cdPais={1}
                id="cidade"
                isClearable={true}
                cdUF={filtrosPesquisa.estado}
                onChange={handleChangeForm}
                value={filtrosPesquisa.cidade}
            />
        </div>
    );
};

export default FiltroBuscaCandidatos;
