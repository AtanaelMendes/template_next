import Select from '@/components/inputs/Select';
import { useBuscaCandidatosContext } from '@/context/BuscaCandidatosContext';
import { useEffect } from 'react';
import SelectTailwind from 'react-tailwindcss-select';
import InputText from '../inputs/InputText';

const FiltroPessoal = ({ active }) => {
	const {
		deficiencia,
		setDeficiencia,
		selectDeficiencia,
		setSelectDeficiencia,
		disableDeficiencia,
		setDisableDeficiencia,
		filters,
		handleFiltersChange,
	} = useBuscaCandidatosContext();

	useEffect(() => {
		setDisableDeficiencia(!selectDeficiencia);
	}, [selectDeficiencia]);

	const opcoesDeficiencias = [
		{
			value: 'fisica',
			label: '🦾 Física',
			isSelected: Array(filters.deficiencias).includes('fisica'),
		},
		{
			value: 'auditiva',
			label: '🦻 Auditiva',
			isSelected: Array(filters.deficiencias).includes('auditiva'),
		},
		{
			value: 'intelectual',
			label: '🧩 Intelectual',
			isSelected: Array(filters.deficiencias).includes('intelectual'),
		},
		{
			value: 'visual',
			label: '🕶 Visual',
			isSelected: Array(filters.deficiencias).includes('visual'),
		},
		{
			value: 'mental',
			label: '🧠 Mental',
			isSelected: Array(filters.deficiencias).includes('mental'),
		},
		{
			value: 'reabilitado',
			label: '👍 Reabilitado',
			isSelected: Array(filters.deficiencias).includes('reabilitado'),
		},
	];

	const handleChangeDeficiencia = (_, value) => {
		const disable = value === 'false';
		setSelectDeficiencia(!disable);

		if (disable) {
			handleChangeDeficienciaValue(null);
		} else {
			setDisableDeficiencia(!disable);
			handleChangeDeficienciaValue(opcoesDeficiencias);
		}
	};

	const handleChangeDeficienciaValue = value => {
		value = value || [];
		setDeficiencia(value);
		handleFiltersChange({ target: { name: 'deficiencias', value: value, type: 'generic' } });
	};

	const handleGenericChange = (id, value) => {
		handleFiltersChange({ target: { name: id, value: value, type: 'generic' } });
	};

	if (!active) return null;

	return (
		<div className='flex flex-col flex-grow p-4'>
			<div className='flex flex-col w-full gap-8 pt-4 lg:flex-row'>
				<div className='w-full lg:w-1/3'>
					<Select
						id='estadoCivil'
						label={'Estado Civil'}
						hideClearButton={true}
						onChange={handleGenericChange}
						options={[
							{ label: 'Todos', value: '', select: true },
							{ label: 'Solteiro', value: 'S', select: false },
							{ label: 'Casado', value: 'C', select: false },
							{ label: 'Divorciado', value: 'D', select: false },
							{ label: 'União Estável', value: 'A', select: false },
							{ label: 'Viúvo', value: 'V', select: false },
						]}
						value={filters.estadoCivil}
					/>
				</div>

				<div className='w-full lg:w-1/3'>
					<Select
						id='fumante'
						label={'Fumante'}
						hideClearButton={true}
						onChange={handleGenericChange}
						options={[
							{ label: 'Todos', value: '', select: true },
							{ label: 'Sim', value: 'S', select: false },
							{ label: 'Não', value: 'N', select: false },
						]}
						value={filters.fumante}
					/>
				</div>
				<div className='w-full lg:w-1/3'>
					<Select
						id='habilitacao'
						label={'Habilitação'}
						hideClearButton={true}
						onChange={handleGenericChange}
						options={[
							{ label: 'Todos', value: '', select: true },
							{ label: 'A', value: 'A', select: false },
							{ label: 'B', value: 'B', select: false },
							{ label: 'AB', value: 'AB', select: false },
							{ label: 'C', value: 'C', select: false },
							{ label: 'AC', value: 'AC', select: false },
							{ label: 'D', value: 'D', select: false },
							{ label: 'AD', value: 'AD', select: false },
							{ label: 'E', value: 'E', select: false },
							{ label: 'AE', value: 'AE', select: false },
						]}
						value={filters.habilitacao}
					/>
				</div>
			</div>

			<div className='flex flex-col items-center w-full gap-8 pt-4 lg:flex-row'>
				<div className='w-full lg:w-1/3'>
					<Select
						id='veiculos'
						label={'Veículos'}
						hideClearButton={true}
						onChange={handleGenericChange}
						options={[
							{ label: 'Todos', value: '', select: true },
							{ label: 'Sim', value: 'S', select: false },
							{ label: 'Não', value: 'N', select: false },
						]}
						value={filters.veiculos}
					/>
				</div>
				<div className='flex flex-col w-full lg:w-1/3'>
					<label htmlFor='peso' className='mr-2 py-1 '>
						Peso
					</label>
					<div className='flex flex-row items-center gap-5'>
						<InputText
							value={filters.pesoDe}
							onChange={handleGenericChange}
							placeholder={'De'}
							maxLength={3}
							mask={'numeric'}
							id='pesoDe'
						/>

						<InputText
							value={filters.pesoAte}
							maxLength={3}
							placeholder={'Até'}
							mask={'numeric'}
							onChange={handleGenericChange}
							id='pesoAte'
						/>
					</div>
				</div>

				<div className='flex flex-col w-full lg:w-1/3'>
					<label htmlFor='altura' className='mr-2 py-1'>
						Altura
					</label>
					<div className='flex flex-row items-center gap-5'>
						<InputText
							id='alturaDe'
							mask={'altura'}
							placeholder={'De'}
							value={filters.alturaDe}
							onChange={handleGenericChange}
						/>
						<InputText
							id='alturaAte'
							mask={'altura'}
							placeholder={'Até'}
							value={filters.alturaAte}
							onChange={handleGenericChange}
						/>
					</div>
				</div>
			</div>

			<div className='flex flex-col lg:flex-row items-center w-full gap-8 pt-4'>
				<div className='w-full lg:w-1/3'>
					<Select
						id='sexo'
						label={'Sexo'}
						hideClearButton={true}
						onChange={handleGenericChange}
						options={[
							{ label: 'Todos', value: '', select: true },
							{ label: 'Feminino', value: 'F', select: false },
							{ label: 'Masculino', value: 'M', select: false },
						]}
						value={filters.sexo}
					/>
				</div>
				<div className='flex flex-col w-full lg:w-1/3'>
					<label htmlFor='idade' className=' py-1'>
						Idade
					</label>
					<div className='flex flex-row items-center gap-5'>
						<InputText
							id='idadeDe'
							maxLength={2}
							placeholder={'De'}
							mask={'numeric'}
							onChange={handleGenericChange}
							value={filters.idadeDe}
						/>

						<InputText
							id='idadeAte'
							maxLength={2}
							placeholder={'Até'}
							mask={'numeric'}
							onChange={handleGenericChange}
							value={filters.idadeAte}
						/>
					</div>
				</div>
				<div className='flex flex-col w-1/3'></div>
			</div>

			<div className='flex flex-row gap-8 pt-4 w-full'>
				<div className='space-y-2 self-end w-1/2'>
					<Select
						id='selectDeficiencias'
						label={'Deficiencias'}
						hideClearButton={true}
						onChange={handleChangeDeficiencia}
						value={selectDeficiencia ? 'true' : 'false'}
						options={[
							{ label: 'Não', value: 'false', select: !selectDeficiencia },
							{ label: 'Sim', value: 'true', select: selectDeficiencia },
						]}
					/>
				</div>
				<div className='w-1/2 self-end'>
					<SelectTailwind
						id='deficiencias'
						value={deficiencia}
						onChange={handleChangeDeficienciaValue}
						options={opcoesDeficiencias}
						isMultiple={true}
						isSearchable={true}
						isClearable={true}
						noOptionsMessage={'Sem opções'}
						placeholder={'Escolha as deficiências'}
						searchInputPlaceholder={'Pesquise as deficiências aqui'}
						isDisabled={disableDeficiencia}
						formatGroupLabel={data => (
							<div className={`py-2 text-xs flex items-center justify-between`}>
								<span className='font-bold'>{data.label}</span>
								<span className='bg-gray-200 p-1.5 flex items-center justify-center rounded-full'>
									{data.options.length}
								</span>
							</div>
						)}
					/>
				</div>
			</div>
		</div>
	);
};

export default FiltroPessoal;
