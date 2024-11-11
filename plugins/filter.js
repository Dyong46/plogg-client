import Vue from "vue";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default ({ app }, inject) => {
	inject("filter", Vue.observable({
		buildingWhere ({ filterValues, filterPatho }) {
			let where = {
				...app.$where.in("properties.tint.en", filterValues.colors),
				...app.$where.in("properties.brand", filterValues.vendors),
				...app.$where.in("properties.material.en", filterValues.materials)
			};

			const noGripQuery = this.getGripQuery(filterValues.grip);

			if (noGripQuery.$or.length > 0) {
				where = {
					...where,
					...noGripQuery
				};
			}

			if (filterPatho && !app.$global.isAdmin()) {
				if (filterPatho.allergies.length > 0) {
					where = {
						...where,
						$or: [
							app.$where.exists("properties.material", false),
							app.$where.regex("properties.material.en", `^(?!${filterPatho.allergies.join("|")})`, "i")
						]
					};
				}

				const measurementQuery = this.getMeasurementQuery(filterPatho.measurementValues.values);

				if (measurementQuery.$and.length > 0) {
					where = {
						...where,
						...measurementQuery
					};
				}

				const toesValue = filterPatho.prescription.toes;

				where = {
					...where,
					...app.$where.eq("properties.compression", filterPatho.prescription.compression),
					...app.$where.exists("properties.toes.value", toesValue),
					...app.$where.in("properties.type.value", filterPatho.types),
					...app.$where.in("properties.gender.value", filterPatho.gender)
				};
			}

			return where;
		},
		getMeasurementQuery (values) {
			return Object.keys(values).reduce((result, key) => {
				const baseFiled = `properties.${key}`;
				const minField = `${baseFiled}.min`;
				const maxField = `${baseFiled}.max`;

				return {
					$and: [
						...result.$and,
						app.$where.betweenIfExist(
							baseFiled,
							minField,
							maxField,
							+values[key]
						)
					]
				};
			}, {
				$and: []
			});
		},
		getGripQuery (grip) {
			const query = {
				$or: []
			};

			if (grip.includes("grip")) {
				query.$or = [
					...query.$or,
					app.$where.exists("properties.grip", true)
				];
			}

			if (grip.includes("noGrip")) {
				query.$or = [
					...query.$or,
					app.$where.exists("properties.grip", false)
				];
			}

			return query;
		}
	}));
};
